package repository

import (
	"github.com/evgeny-tokarev/crud_golang_react/database/migrations"
	"github.com/evgeny-tokarev/crud_golang_react/database/models"
	"github.com/gofiber/fiber/v2"
	"github.com/morkid/paginate"
	"gopkg.in/go-playground/validator.v9"
	"net/http"
)

type ErrorResponse struct {
	FailedField string
	Tag         string
	Value       string
}

var validate = validator.New()

func ValidateStruct(user models.User) []*ErrorResponse {
	var errors []*ErrorResponse
	err := validate.Struct(user)
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			var element ErrorResponse
			element.FailedField = err.StructNamespace()
			element.Tag = err.Tag()
			element.Value = err.Param()
			errors = append(errors, &element)
		}
	}
	return errors
}

func (repo *Repository) GetUsers(context *fiber.Ctx) error {
	db := repo.DB
	model := db.Model(&migrations.Users{})
	pg := paginate.New(&paginate.Config{
		DefaultSize:        20,
		CustomParamEnabled: true,
	})
	page := pg.With(model).Request(context.Request()).Response(&[]migrations.Users{})
	err := context.Status(http.StatusOK).JSON(&fiber.Map{
		"data": page,
	})
	if err != nil {
		return err
	}
	return nil
}
func (repo *Repository) CreateUser(context *fiber.Ctx) error {
	user := models.User{}
	err := context.BodyParser(&user)
	if err != nil {
		err := context.Status(http.StatusUnprocessableEntity).JSON(&fiber.Map{
			"message": "Request failed",
		})
		if err != nil {
			return err
		}
		return err
	}
	errors := ValidateStruct(user)
	if errors != nil {
		return context.Status(http.StatusBadRequest).JSON(errors)
	}
	existingUser := models.User{}
	if err := repo.DB.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
		return context.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "Email already exists",
		})
	}
	if err = repo.DB.Create(&user).Error; err != nil {
		return context.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"status":  "error",
			"message": "Could not create user",
			"data":    err,
		})
	}
	context.Status(http.StatusOK).JSON(&fiber.Map{
		"message": "Successfully created new user",
		"data":    user,
	})
	return nil
}
func (repo *Repository) UpdateUser(context *fiber.Ctx) error {
	user := models.User{}
	err := context.BodyParser(&user)
	if err != nil {
		err := context.Status(http.StatusUnprocessableEntity).JSON(&fiber.Map{
			"message": "Request failed",
		})
		if err != nil {
			return err
		}
		return err
	}
	errors := ValidateStruct(user)
	if errors != nil {
		return context.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": errors,
		})
	}
	db := repo.DB
	id := context.Params("id")
	if id == "" {
		err := context.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "id can't be empty",
		})
		if err != nil {
			return err
		}
		return nil
	}
	if db.Model(&user).Where("id = ?", id).Updates(&user).RowsAffected == 0 {
		err := context.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "Could not get user profile",
		})
		if err != nil {
			return err
		}
		return nil
	}
	context.Status(http.StatusOK).JSON(&fiber.Map{
		"status":  "success",
		"message": "Successfully updated the user",
		"data":    user,
	})

	return nil
}
func (repo *Repository) RemoveUser(context *fiber.Ctx) error {
	userModel := &migrations.Users{}
	id := context.Params("id")
	if id == "" {
		err := context.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "id can't be empty",
		})
		if err != nil {
			return err
		}
		return nil
	}
	err := repo.DB.Delete(userModel, id)
	if err.Error != nil {
		err := context.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "Could not remove the user",
		})
		if err != nil {
			return err
		}
		return err
	}
	context.Status(http.StatusOK).JSON(&fiber.Map{
		"status":  "success",
		"message": "Successfully deleted the user",
	})
	return nil
}
func (repo *Repository) GetUser(context *fiber.Ctx) error {
	userModel := &migrations.Users{}
	id := context.Params("id")
	if id == "" {
		err := context.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "id can't be empty",
		})
		if err != nil {
			return err
		}
		return nil
	}
	err := repo.DB.Where("id = ?", id).First(userModel).Error
	if err != nil {
		err := context.Status(http.StatusBadRequest).JSON(&fiber.Map{
			"message": "Could not get the user",
		})
		if err != nil {
			return err
		}
		return err
	}
	context.Status(http.StatusOK).JSON(&fiber.Map{
		"status":  "success",
		"message": "Successfully fetched the user",
		"data":    userModel,
	})
	return nil
}
