package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"reflect"

	"github.com/joho/godotenv"
	"go.sia.tech/core/types"
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

	// target
	c.Contracts.Amount = 400

	// gouging
	g.MaxStoragePrice = types.Siacoins(5000)
	g.MaxRPCPrice = types.Siacoins(1000)
	g.MinMaxEphemeralAccountBalance = types.Siacoins(1)
	// g.MinAccountExpiry = 1

	// pruning
	g.MaxDownloadPrice = types.Siacoins(1000)

	// contract
	// c.Contracts.Period = 10
	// c.Contracts.RenewWindow = 10

	e, _ := a.EvaluateConfig(ctx, c, g, r)

	fmt.Println("config:")
	printStruct(c)
	fmt.Println("gouging:")
	printStruct(g)
	fmt.Println("redundancy:")
	printStruct(r)
	fmt.Println("eval:")
	printStruct(e)
}

func encodeJSON(w io.Writer, v any) error {
	// encode nil slices as [] instead of null
	if val := reflect.ValueOf(v); val.Kind() == reflect.Slice && val.Len() == 0 {
		_, err := w.Write([]byte("[]\n"))
		return err
	}
	enc := json.NewEncoder(w)
	enc.SetIndent("", "  ")
	return enc.Encode(v)
}

func printStruct(v any) error {
	return encodeJSON(os.Stdout, v)
}
