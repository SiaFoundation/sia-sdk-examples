package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"reflect"

	"github.com/joho/godotenv"
	"go.sia.tech/renterd/api"
	"go.sia.tech/renterd/autopilot"
	"go.sia.tech/renterd/bus"
)

func main() {
	godotenv.Load()

	ctx := context.Background()

	addr := os.Getenv("RENTERD_API")
	password := os.Getenv("RENTERD_PASSWORD")

	b := bus.NewClient(addr+"/bus", password)
	a := autopilot.NewClient(addr+"/autopilot", password)

	contracts, _ := b.Contracts(ctx, api.ContractsOpts{
		ContractSet: "autopilot",
	})
	g, _ := b.GougingSettings(ctx)
	r, _ := b.RedundancySettings(ctx)
	c, _ := a.Config()

	// target
	fmt.Println("--- Current contracts ---")
	fmt.Println("Contracts:", len(contracts))
	mult := 1.1
	c.Contracts.Amount = uint64(float64(c.Contracts.Amount) * mult)
	e1, _ := a.EvaluateConfig(ctx, c, g, r)
	fmt.Println("--- Target contracts ---")
	fmt.Println("Mult:", mult)
	fmt.Println("Contracts.Amount:", c.Contracts.Amount)
	printStruct(e1)

	mult = 1.5
	c.Contracts.Amount = uint64(float64(c.Contracts.Amount) * mult)
	e2, _ := a.EvaluateConfig(ctx, c, g, r)
	fmt.Println("--- Target contracts ---")
	fmt.Println("Mult:", mult)
	fmt.Println("Contracts.Amount:", c.Contracts.Amount)
	printStruct(e2)

	// gouging
	// g.MaxStoragePrice = types.Siacoins(5000)
	// g.MaxRPCPrice = types.Siacoins(1000)
	// g.MinMaxEphemeralAccountBalance = types.Siacoins(1)
	// g.MinAccountExpiry = 1

	// pruning
	// g.MaxDownloadPrice = types.Siacoins(1030)

	// contract
	// c.Contracts.Period = 10
	// c.Contracts.RenewWindow = 10

	// e2, _ := a.EvaluateConfig(ctx, c, g, r)
	// fmt.Println("--- After ---")
	// fmt.Println("MaxDownloadPrice:", g.MaxDownloadPrice)
	// printStruct(e2)
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
