package main

import (
	"context"
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"go.sia.tech/renterd/autopilot"
	"go.sia.tech/renterd/bus"
)

func main() {
	godotenv.Load()

	ctx := context.Background()

	api := os.Getenv("RENTERD_API")
	password := os.Getenv("RENTERD_PASSWORD")

	b := bus.NewClient(api+"/bus", password)
	a := autopilot.NewClient(api+"/autopilot", password)

	g, _ := b.GougingSettings(ctx)
	r, _ := b.RedundancySettings(ctx)
	c, _ := a.Config()

	e, _ := a.EvaluateConfig(ctx, c, g, r)

	fmt.Printf("%+v\n", e)
}
