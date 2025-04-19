/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"encoding/json"
	"fmt"
	"go/parser"
	"go/token"
	"log"
	"os"

	"github.com/spf13/cobra"
)

// randomCmd represents the random command
var randomCmd = &cobra.Command{
	Use:   "random",
	Short: "A brief description of your command",
	Long: `A longer description that spans multiple lines and likely contains examples
and usage of using your command. For example:

Cobra is a CLI library for Go that empowers applications.
This application is a tool to generate the needed files
to quickly create a Cobra application.`,
	Run: func(cmd *cobra.Command, args []string) {
		findAllUnused()
	},
}

func init() {
	rootCmd.AddCommand(randomCmd)

	// Here you will define your flags and configuration settings.

	// Cobra supports Persistent Flags which will work for this command
	// and all subcommands, e.g.:
	// randomCmd.PersistentFlags().String("foo", "", "A help for foo")

	// Cobra supports local flags which will only run when this command
	// is called directly, e.g.:
	// randomCmd.Flags().BoolP("toggle", "t", false, "Help message for toggle")
}

type Variable struct {
	VarName    string `json: "varname"`
	LineNumber int    `json: "linenum"`
}

type Output struct {
	Variables []Variable `json: "variables"`
}

func findAllUnused() {
	//logic to find all the variables i guess

	//something
	varOne := Variable{VarName: "Pluto", LineNumber: 10}
	varTwo := Variable{VarName: "bok", LineNumber: 29}

	variables := Output{[]Variable{varOne, varTwo}}

	//create json file

	file, error := os.Create("output/variables.json")

	if error != nil {
		fmt.Print(error)
		fmt.Println("Sorry some error occurred")
		return
	}
	defer file.Close() //what does defer mean? defer means you run this command safely once this file exits or closes or fails

	encoder := json.NewEncoder(file)
	encoder.SetIndent("", "  ") // pretty print (optional)
	if err := encoder.Encode(variables); err != nil {
		log.Fatal("Error encoding JSON:", err)
	}
	fmt.Print("Successfully wrote all variables to output JSON.")
}

func something() {

	fset := token.NewFileSet() // positions are relative to fset

	src := `package foo

			import (
				"fmt"
				"time"
			)

			func bar() {
				fmt.Println(time.Now())
			}`

	// Parse src but stop after processing the imports.
	f, err := parser.ParseFile(fset, "", src, parser.ImportsOnly)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Print(f)
}
