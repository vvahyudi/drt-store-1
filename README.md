# DRT Store

DRT Store adalah aplikasi e-commerce modern yang dibangun dengan Next.js 14, TypeScript, dan Tailwind CSS.

## 🚀 Fitur

- 🔐 Autentikasi dengan NextAuth.js
- 🛍️ Manajemen Produk
- 📦 Manajemen Kategori
- 🛒 Keranjang Belanja
- 📝 Manajemen Pesanan
- 📱 Responsive Design
- 🎨 UI Modern dengan Tailwind CSS
- 🔄 State Management dengan React Query

## 🛠️ Teknologi

- **Frontend:**

  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - React Query
  - NextAuth.js
  - Shadcn UI
  - Lucide Icons

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication

## 📦 Instalasi

1. Clone repository:

```bash
git clone https://github.com/yourusername/drt-store.git
cd drt-store
```

2. Install dependencies:

```bash
npm install
# atau
yarn install
```

3. Setup environment variables:

```bash
cp .env.example .env.local
```

4. Jalankan development server:

```bash
npm run dev
# atau
yarn dev
```

## 🔑 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## 📡 API Endpoints

### Authentication

```typescript
POST / api / auth / login
Body: {
	username: string
	password: string
}
Response: {
	data: {
		id: string
		name: string
		email: string
		token: string
	}
}
```

### Products

```typescript
GET /api/products
Query Parameters:
  - page: number
  - limit: number
  - search: string
  - category: string
  - sort: string
Response: {
  data: Product[]
  total: number
  page: number
  limit: number
}

GET /api/products/:id
Response: {
  data: Product
}

POST /api/products
Body: {
  name: string
  description: string
  price: number
  stock: number
  categoryId: string
  images: string[]
}
Response: {
  data: Product
}

PUT /api/products/:id
Body: {
  name?: string
  description?: string
  price?: number
  stock?: number
  categoryId?: string
  images?: string[]
}
Response: {
  data: Product
}

DELETE /api/products/:id
Response: {
  message: string
}
```

### Categories

```typescript
GET /api/categories
Query Parameters:
  - page: number
  - limit: number
  - search: string
Response: {
  data: Category[]
  total: number
  page: number
  limit: number
}

GET /api/categories/:id
Response: {
  data: Category
}

POST /api/categories
Body: {
  name: string
  description: string
}
Response: {
  data: Category
}

PUT /api/categories/:id
Body: {
  name?: string
  description?: string
}
Response: {
  data: Category
}

DELETE /api/categories/:id
Response: {
  message: string
}
```

### Orders

```typescript
GET /api/orders
Query Parameters:
  - page: number
  - limit: number
  - status: string
Response: {
  data: Order[]
  total: number
  page: number
  limit: number
}

GET /api/orders/:id
Response: {
  data: Order
}

POST /api/orders
Body: {
  items: {
    productId: string
    quantity: number
  }[]
  shippingAddress: {
    address: string
    city: string
    postalCode: string
    country: string
  }
}
Response: {
  data: Order
}

PUT /api/orders/:id/status
Body: {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
}
Response: {
  data: Order
}
```

## 📁 Struktur Proyek

```
src/
├── app/                    # App router pages
│   ├── (admin)/           # Admin routes
│   ├── (auth)/            # Auth routes
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # UI components
│   └── layout/           # Layout components
├── hooks/                # Custom hooks
├── lib/                  # Utility functions
├── types/                # TypeScript types
└── styles/              # Global styles
```

## 👥 Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add some amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

## 📝 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## 🤝 Kontak

Ahmad - [@yourusername](https://twitter.com/yourusername)

Project Link: [https://github.com/yourusername/drt-store](https://github.com/yourusername/drt-store)
