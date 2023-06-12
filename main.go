package main

import (
	"github.com/evgeny-tokarev/crud_golang_react/bootstrap"
	"github.com/gofiber/fiber/v2"
)

func main() {
	app := *fiber.New()
	bootstrap.InitializeApp(app)
}
