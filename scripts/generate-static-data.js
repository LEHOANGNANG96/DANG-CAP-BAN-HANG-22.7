import axios from 'axios';
import { parse } from 'csv-parse/sync';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import slugify from 'slugify';

// Load config from config.json
const configPath = path.join(process.cwd(), 'config.json');
let GOOGLE_SHEET_ID = '2PACX-1vSno9tAM8tlClNXI6wNqurTMurAgrb90xF5Q5AUag3HauAC0eAVpd67h1C1M1bGpHc7x8WShHpV9dc7';
let GOOGLE_SHEET_GID = '443074711';

if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  if (config.GOOGLE_SHEET_ID) GOOGLE_SHEET_ID = config.GOOGLE_SHEET_ID;
  if (config.GOOGLE_SHEET_GID) GOOGLE_SHEET_GID = config.GOOGLE_SHEET_GID;
}

const GOOGLE_SHEET_CSV_URL = GOOGLE_SHEET_ID.startsWith('2PACX-')
  ? `https://docs.google.com/spreadsheets/d/e/${GOOGLE_SHEET_ID}/pub?gid=${GOOGLE_SHEET_GID}&single=true&output=csv`
  : `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv&gid=${GOOGLE_SHEET_GID}`;

function slugifyText(text) {
  return slugify(text, { lower: true, strict: true, locale: 'vi' });
}

function removeVietnameseTones(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

async function run() {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  const searchIndexPath = path.join(dataDir, 'search-index.json');
  const allDir = path.join(dataDir, 'products', 'all');
  
  if (fs.existsSync(searchIndexPath)) {
    try {
      const stats = fs.statSync(searchIndexPath);
      const allFiles = fs.existsSync(allDir) ? fs.readdirSync(allDir) : [];
      if (stats.size > 10 * 1024 * 1024 && allFiles.length > 500) {
        console.log('--- [BUILD] Dữ liệu tĩnh đã được đồng bộ sẵn trong mã nguồn (Size:', (stats.size / 1024 / 1024).toFixed(2), 'MB,', allFiles.length, 'file paginated products). ---');
        console.log('--- Bỏ qua việc tải lại 41MB từ Google Sheets để tăng tốc build và tránh lỗi giới hạn (Voucher/Quota). ---');
        console.log('--- Nếu muốn đồng bộ lại, hãy chạy thủ công từ Trang quản trị UI hoặc xóa file public/data/search-index.json. ---');
        return;
      }
    } catch (checkErr) {
      console.warn('Failed to check existing static files:', checkErr);
    }
  }

  console.log('Fetching data from Google Sheets...');
  try {
    const response = await axios.get(GOOGLE_SHEET_CSV_URL);
    const csvData = response.data;
    console.log('CSV Data length:', csvData.length);

    const records = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true
    });

    console.log('Parsed records:', records.length);

    if (records.length === 0) {
      console.log('No records found in CSV.');
      return;
    }

    const allProducts = [];

    for (const row of records) {
      const r = row;
      
      const getVal = (keys) => {
        const foundKey = Object.keys(r).find(k => 
          keys.some(target => k.trim().toLowerCase() === target.toLowerCase())
        );
        return foundKey ? String(r[foundKey]).trim() : null;
      };

      const rawName = getVal(['Tên sản phẩm', 'Name', 'tên', 'Sản phẩm', 'Tiêu đề', 'Product Name', 'Title', 'Tên']) || '';
      const name = rawName;
      
      const affiliateUrl = getVal(['LINK SẢN PHẨM', 'Link Sản Phẩm', 'AffiliateUrl', 'link', 'URL', 'Liên kết', 'Link', 'Shopee Link', 'Đường dẫn']) || 'https://shopee.vn';
      const rawCategory = getVal(['Chuyên mục', 'Category', 'loại', 'Danh mục', 'Nhóm', 'Phân loại', 'Group']) || 'Khác';
      const category = rawCategory.split('>')[0].trim(); // Take main category
      const discountPrice = getVal(['Giá', 'Giá ưu đãi', 'Giá KM', 'Giá mới', 'Giá bán', 'Sale Price', 'DiscountPrice']) || '';
      const originalPrice = getVal(['Giá cao nhất', 'Giá gốc', 'Giá cũ', 'Giá niêm yết', 'OriginalPrice', 'Old Price']) || '';
      const image = getVal(['Ảnh_1', 'Image', 'ảnh', 'Hình ảnh', 'Thumbnail', 'Ảnh', 'Link ảnh', 'Hình']) || 'https://picsum.photos/seed/product/400/400';
      const discountPercent = getVal(['% ĐÃ GIẢM', '% ưu đãi giảm', '% ưu đãi', 'Ưu đãi', 'Giảm giá', '% Giảm giá', 'Discount', '%đã giảm', '% đã giảm', 'DiscountPercent']) || '';
      const soldCount = getVal(['Đã bán trong 30 ngày', 'Bán trong 30 ngày', 'SoldCount', 'Đã bán', 'Sold', 'Sales', 'Bán']) || '';
      const ratingCount = getVal(['Đánh giá', 'Rating Count', 'Ratings']) || '';
      const likesCount = getVal(['Thích', 'Likes', 'Like Count']) || '';
      const ratingScore = getVal(['Điểm đánh giá', 'Rating Score', 'Rating']) || '';
      const badge = getVal(['Badge', 'Nhãn', 'Huy hiệu']) || '';

      if (!name && !image) continue;

      const numericPrice = parseInt(discountPrice.replace(/\D/g, '')) || 0;
      
      let numericSoldCount = 0;
      if (soldCount) {
        const soldStr = String(soldCount).toLowerCase().replace(/[^0-9k]/g, '');
        if (soldStr.includes('k')) {
          numericSoldCount = Math.round(parseFloat(soldStr.replace('k', '')) * 1000);
        } else {
          numericSoldCount = parseInt(soldStr) || 0;
        }
      }

      const createdAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const searchName = `${rawName.toLowerCase()} ${removeVietnameseTones(rawName)} ${category.toLowerCase()} ${removeVietnameseTones(category)}`.substring(0, 500);

      const namePart = String(name).toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
      const urlHash = Math.abs(affiliateUrl.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0)).toString(36);
      const extId = `p_${namePart}_${urlHash}`;

      allProducts.push({
        name,
        image,
        originalPrice,
        discountPrice,
        numericPrice,
        category,
        badge,
        affiliateUrl,
        discountPercent,
        soldCount,
        numericSoldCount,
        ratingCount,
        likesCount,
        ratingScore,
        createdAt,
        searchName,
        externalId: extId
      });
    }

    console.log(`Total products parsed: ${allProducts.length}`);

    // Sync into SQLite products.db
    try {
      console.log('Writing products to SQLite (products.db)...');
      const db = new Database('products.db');
      
      db.exec(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          externalId TEXT,
          name TEXT NOT NULL,
          fullName TEXT,
          searchName TEXT,
          image TEXT NOT NULL,
          originalPrice TEXT,
          discountPrice TEXT,
          numericPrice INTEGER,
          category TEXT,
          rawCategory TEXT,
          badge TEXT,
          affiliateUrl TEXT,
          videoUrl TEXT,
          discountPercent TEXT,
          soldCount TEXT,
          numericSoldCount INTEGER,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Add columns for rating and social counts if they don't exist
      try { db.exec("ALTER TABLE products ADD COLUMN ratingCount TEXT;"); } catch (e) {}
      try { db.exec("ALTER TABLE products ADD COLUMN likesCount TEXT;"); } catch (e) {}
      try { db.exec("ALTER TABLE products ADD COLUMN ratingScore TEXT;"); } catch (e) {}

      db.prepare('DELETE FROM products').run();

      const insertStmt = db.prepare(`
        INSERT INTO products (
          externalId, name, searchName, image, originalPrice, discountPrice, 
          numericPrice, category, badge, affiliateUrl, discountPercent, 
          soldCount, numericSoldCount, ratingCount, likesCount, ratingScore, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const insertMany = db.transaction((products) => {
        for (const p of products) {
          insertStmt.run(
            p.externalId,
            p.name,
            p.searchName,
            p.image,
            p.originalPrice,
            p.discountPrice,
            p.numericPrice,
            p.category,
            p.badge,
            p.affiliateUrl,
            p.discountPercent,
            p.soldCount,
            p.numericSoldCount,
            p.ratingCount,
            p.likesCount,
            p.ratingScore,
            p.createdAt
          );
        }
      });

      insertMany(allProducts);
      console.log('SQLite database updated successfully with ' + allProducts.length + ' products.');
    } catch (sqliteError) {
      console.error('Failed to update SQLite database:', sqliteError);
    }

    const dataDir = path.join(process.cwd(), 'public', 'data');
    const productsDir = path.join(dataDir, 'products');
    
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    if (fs.existsSync(productsDir)) fs.rmSync(productsDir, { recursive: true, force: true });
    fs.mkdirSync(productsDir, { recursive: true });

    // 1. Save Meta
    const categories = Array.from(new Set(allProducts.map((p) => p.category))).filter(Boolean);
    const meta = {
      totalProducts: allProducts.length,
      lastUpdate: new Date().toISOString(),
      categories
    };
    fs.writeFileSync(path.join(dataDir, 'meta.json'), JSON.stringify(meta, null, 2));

    // 2. Save Categories
    const categoriesData = categories.map(name => {
      const firstProduct = allProducts.find((p) => p.category === name);
      return {
        id: slugifyText(name),
        name,
        image: firstProduct?.image || 'https://picsum.photos/seed/cat/400/400',
        count: allProducts.filter((p) => p.category === name).length
      };
    });
    fs.writeFileSync(path.join(dataDir, 'categories.json'), JSON.stringify(categoriesData, null, 2));

    // 3. Save Search Index (Comprehensive for client-side search/sort)
    const searchIndex = allProducts.map((p) => ({
      i: p.externalId,
      n: p.name,
      n_n: removeVietnameseTones(p.name || '').toLowerCase(),
      c: p.category,
      p: p.discountPrice,
      op: p.originalPrice,
      img: p.image,
      u: p.affiliateUrl,
      pct: p.discountPercent,
      s: p.soldCount,
      rc: p.ratingCount,
      lc: p.likesCount,
      rs: p.ratingScore,
      b: p.badge,
      np: p.numericPrice,
      ns: p.numericSoldCount
    }));
    fs.writeFileSync(path.join(dataDir, 'search-index.json'), JSON.stringify(searchIndex));

    // 4. Save Paginated Products
    const pageSize = 100;
    const savePages = (items, subDir) => {
      const dir = path.join(productsDir, subDir);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      
      const totalPages = Math.ceil(items.length / pageSize);
      for (let i = 1; i <= totalPages; i++) {
        const pageItems = items.slice((i - 1) * pageSize, i * pageSize);
        fs.writeFileSync(path.join(dir, `${i}.json`), JSON.stringify({
          products: pageItems,
          total: items.length,
          page: i,
          totalPages
        }));
      }
    };

    savePages(allProducts, 'all');

    const grouped = allProducts.reduce((acc, p) => {
      const cat = p.category || 'Khác';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(p);
      return acc;
    }, {});

    for (const [cat, items] of Object.entries(grouped)) {
      const catSlug = slugifyText(cat);
      savePages(items, catSlug);
    }

    console.log('Static export completed successfully.');

  } catch (error) {
    console.error('Operation failed:', error);
  }
}

run();
