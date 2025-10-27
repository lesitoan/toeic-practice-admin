# TOEIC Practice Admin - API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
Tất cả API (trừ auth) đều cần Bearer token trong header:
```
Authorization: Bearer <access_token>
```

---

## 1. Authentication APIs

### POST /auth/login
Đăng nhập user

**Request:**
```json
{
  "email": "admin@toeic.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@toeic.com",
    "role": "admin",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### POST /auth/register
Đăng ký user mới

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 2,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### POST /auth/logout
Đăng xuất user

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### POST /auth/refresh
Refresh access token

**Request:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 2. User Management APIs

### GET /users
Lấy danh sách users

**Query Parameters:**
- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số items per page (default: 10)
- `search` (optional): Tìm kiếm theo tên hoặc email
- `role` (optional): Lọc theo role (admin, user)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Admin User",
      "email": "admin@toeic.com",
      "role": "admin",
      "status": "active",
      "lastLogin": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### GET /users/:id
Lấy thông tin user theo ID

**Response:**
```json
{
  "id": 1,
  "name": "Admin User",
  "email": "admin@toeic.com",
  "role": "admin",
  "status": "active",
  "lastLogin": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-15T10:30:00Z",
  "stats": {
    "totalTests": 25,
    "averageScore": 85.5,
    "lastTestDate": "2024-01-15T10:30:00Z"
  }
}
```

---

## 3. Vocabulary Management APIs

### GET /vocabulary
Lấy danh sách từ vựng

**Query Parameters:**
- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số items per page (default: 10)
- `search` (optional): Tìm kiếm theo từ hoặc định nghĩa
- `category` (optional): Lọc theo category
- `difficulty` (optional): Lọc theo difficulty (beginner, intermediate, advanced)
- `partOfSpeech` (optional): Lọc theo part of speech

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "word": "abundant",
      "definition": "existing in large quantities; plentiful",
      "pronunciation": "/əˈbʌndənt/",
      "partOfSpeech": "adjective",
      "example": "The region has abundant natural resources.",
      "difficulty": "intermediate",
      "category": "general",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10
  }
}
```

### GET /vocabulary/:id
Lấy thông tin từ vựng theo ID

### POST /vocabulary
Tạo từ vựng mới

**Request:**
```json
{
  "word": "abundant",
  "definition": "existing in large quantities; plentiful",
  "pronunciation": "/əˈbʌndənt/",
  "partOfSpeech": "adjective",
  "example": "The region has abundant natural resources.",
  "difficulty": "intermediate",
  "category": "general"
}
```

### PUT /vocabulary/:id
Cập nhật từ vựng

### DELETE /vocabulary/:id
Xóa từ vựng

### GET /vocabulary/categories
Lấy danh sách categories

**Response:**
```json
[
  { "value": "general", "label": "General" },
  { "value": "business", "label": "Business" },
  { "value": "academic", "label": "Academic" },
  { "value": "travel", "label": "Travel" },
  { "value": "technology", "label": "Technology" }
]
```

### GET /vocabulary/difficulty-levels
Lấy danh sách difficulty levels

**Response:**
```json
[
  { "value": "beginner", "label": "Beginner" },
  { "value": "intermediate", "label": "Intermediate" },
  { "value": "advanced", "label": "Advanced" }
]
```

### GET /vocabulary/parts-of-speech
Lấy danh sách parts of speech

**Response:**
```json
[
  { "value": "noun", "label": "Noun" },
  { "value": "verb", "label": "Verb" },
  { "value": "adjective", "label": "Adjective" },
  { "value": "adverb", "label": "Adverb" }
]
```

---

## 4. Test Management APIs

### GET /tests
Lấy danh sách bài test

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "TOEIC Practice Test 1",
      "description": "Listening and Reading Practice",
      "duration": 120,
      "totalQuestions": 100,
      "difficulty": "intermediate",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 25,
    "itemsPerPage": 10
  }
}
```

---

## 5. Results/Analytics APIs

### GET /results
Lấy danh sách kết quả test

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "userId": 1,
      "testId": 1,
      "score": 85,
      "totalQuestions": 100,
      "correctAnswers": 85,
      "timeSpent": 110,
      "completedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10
  }
}
```

### GET /analytics
Lấy dữ liệu analytics tổng quan

**Response:**
```json
{
  "totalUsers": 150,
  "totalTests": 500,
  "totalVocabularies": 1000,
  "averageScore": 78.5,
  "recentActivity": [
    {
      "type": "test_completed",
      "userId": 1,
      "userName": "John Doe",
      "testId": 1,
      "score": 85,
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### GET /analytics/dashboard
Lấy dữ liệu cho dashboard

**Response:**
```json
{
  "stats": {
    "totalUsers": 150,
    "totalTests": 500,
    "totalVocabularies": 1000,
    "averageScore": 78.5
  },
  "scoreDistribution": [
    { "range": "0-20", "count": 5 },
    { "range": "21-40", "count": 15 },
    { "range": "41-60", "count": 30 },
    { "range": "61-80", "count": 45 },
    { "range": "81-100", "count": 25 }
  ],
  "recentTests": [
    {
      "id": 1,
      "userId": 1,
      "userName": "John Doe",
      "score": 85,
      "completedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## Error Responses

Tất cả API đều trả về error theo format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": "Email is required",
      "password": "Password must be at least 6 characters"
    }
  }
}
```

**Common Error Codes:**
- `UNAUTHORIZED`: Token không hợp lệ hoặc hết hạn
- `FORBIDDEN`: Không có quyền truy cập
- `NOT_FOUND`: Không tìm thấy resource
- `VALIDATION_ERROR`: Dữ liệu đầu vào không hợp lệ
- `INTERNAL_ERROR`: Lỗi server

---

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error
