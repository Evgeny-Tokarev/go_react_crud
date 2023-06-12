package bootstrap

import (
	"github.com/evgeny-tokarev/crud_golang_react/database/migrations"
	"github.com/evgeny-tokarev/crud_golang_react/database/storage"
	"github.com/evgeny-tokarev/crud_golang_react/repository"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"log"
	"os"
)

func InitializeApp(app fiber.App) {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("err in finding .env: ", err)
	}
	config := &storage.Config{
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		Password: os.Getenv("DB_PASSWORD"),
		User:     os.Getenv("DB_USER"),
		SSLMode:  os.Getenv("DB_SSLMODE"),
		DBName:   os.Getenv("DB_NAME"),
	}
	db, err := storage.NewConnection(config)
	if err != nil {
		log.Fatal("Could not load the database", err)
	}
	err = migrations.MigrateUsers(db)
	if err != nil {
		log.Fatal("Could not migrate DB", err)
	}
	repo := repository.Repository{DB: *db}
	app.Use(cors.New(cors.Config{AllowCredentials: true}))
	repo.SetupRoutes(&app)
	app.Listen(":8081")
}
