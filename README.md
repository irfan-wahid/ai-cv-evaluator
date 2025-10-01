# Project: AI CV Evaluator

## 1. How to Run Locally
Pastikan **Docker** dan **Docker Compose** sudah terinstall.  
Kemudian jalankan:

```bash
docker compose -f docker-compose.yaml up -d
```

Buat file .env dengan isi yang dapat dilihat pada .env.example

Jalankan file migration untuk membuat table database dengan menjalankan:
```bash
npm run db:migrate  
```

Install dependency pada kedua service dengan perintah:
```bash
npm install
```

Jalankan project dengan perintah:
```bash
npm start
```

Jalankan juga worker karena project ini menggunakan queue ketika mengevaluasi CV dengan menjalankan perintah:
```bash
node queues/workers/evaluation.worker.js  
```

## 2. Architecture Overview
Project ini menggunakan Layered Architecture dengan membagi logic menjadi beberapa bagian, seperti: 
1. Model: Bagian yang merepresentasikan tabel/entitas di database.
2. Repository: Bertugas untuk melakukan query dan berinteraksi dengan database melalui Model.
3. Service: Menangani business logic utama dan memanfaatkan repository untuk akses data.
4. Controller: Menerima request dari client, memanggil service, lalu mengembalikan response ke client.

# 3. List Endpoint
Terdapat beberapa endpoint pada project ini diantaranya:
### Job Vacancy
*   **POST /job-vacancy**: Membuat lowongan pekerjaan.
Curl:
```bash
curl -X POST http://localhost:3000/job-vacancy \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Golang Backend Developer",
    "description": "Proficient knowledge in Golang - minimum 2-4 year, Minimum education S1, Can work in Banking Company, Can work fulltime onsite in Jakarta, Can stay at Jabodetabek area, Experience in microservices project, and can make service in Restful API, Experience in using RDBMS such as MySQL or MS SQL, Experience in Redis or ElasticSearch, Experience in using Kafka or RabbitMQ, Experience is implementing clean code architecture, Experience in Git, Familiar with linux, Understand waterfall or agile SDLC concepts",
    "studyCaseBrief": "test",
    "scoringRubric": {
      "cv": ["match_rate", "technical_skills", "experience_level", "achievements", "cultural_fit"],
      "project": ["correctness", "code_quality", "resilience", "documentation", "creativity"]
    }
  }'
```

### Job Application
*   **POST /job-application/:{jobVacancyId}**: Membuat lamaran pekerjaan.

Request (multipart/form-data):

| Field    | Type | Required | Description                        |
|----------|------|----------|------------------------------------|
| cv       | file | ✅       | File CV kandidat (PDF)             |
| project  | file | ✅       | File project kandidat (PDF/ZIP)    |

Curl:
```bash
curl -X POST http://localhost:3000/job-application/1 \
  -F "cv=@/path/to/cv.pdf" \
  -F "project=@/path/to/project.pdf"
```

*   **POST /job-application/evaluate**: Menjalankan evaluasi CV.
Curl:
```bash
curl -X POST http://localhost:3000/job-application/evaluate \
  -H "Content-Type: application/json" \
  -d '{
    "id": "12345"
  }'
```

*   **GET /job-application/result/:{id}**: Melakukan pengecekan dari proses evaluasi CV.
Curl:
```bash
curl -X GET http://localhost:3000/job-application/result/:{id}
```

### Postman Collection
Atau jika anda ingin menjalankan endpoint di Postman, anda bisa import file cv_evaluator.postman_collection.json