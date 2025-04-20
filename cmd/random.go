/*
Copyright © 2025 NAME HERE <EMAIL ADDRESS>
*/
package cmd

import (
	"encoding/json"
	"fmt"
	"go/ast"
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
	Args: cobra.ExactArgs(1),
	Run: func(cmd *cobra.Command, args []string) {
		findAllUnused(args[0])
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
	VarNames   []string `json: "varname"`
	LineNumber int      `json: "linenum"`
	//could have a seen set so as to not have duplicate variables, but then again this might class across functions
}

type Output struct {
	Variables []Variable `json: "variables"`
}

type Traveller struct {
	hmap map[int][]string
	fset *token.FileSet
}

func (r *Traveller) Visit(node ast.Node) ast.Visitor {
	if node == nil {
		return nil
	}
	//make checks for variables
	if fn, ok := node.(*ast.GenDecl); ok {
		for _, spec := range fn.Specs { // Range over Specs (no need for manual index)
			if valSpec, isValueSpec := spec.(*ast.ValueSpec); isValueSpec { // Check for ValueSpec
				for _, name := range valSpec.Names { // Range over variable names
					fmt.Printf("This here is a variable: %s\n", name.Name)
					fmt.Printf("and this is where it is situated: %s\n", r.fset.Position(name.Pos()))
					pos := r.fset.Position(name.Pos())
					line := pos.Line
					r.hmap[line] = append(r.hmap[line], name.Name)
					fmt.Print("-----------------")
					fmt.Println(r.hmap[line])
					fmt.Print("-----------------")
				}
			}
		}
	}

	if assign, ok := node.(*ast.AssignStmt); ok {
		for _, lhs := range assign.Lhs {
			if ident, ok := lhs.(*ast.Ident); ok {
				pos := r.fset.Position(ident.Pos())
				line := pos.Line
				fmt.Printf("Variable in assignment: %s at line %d\n", ident.Name, line)
				r.hmap[line] = append(r.hmap[line], ident.Name)
			}
		}
	}

	return r
}

func findAllUnused(filepath string) {
	//logic to find all the variables i guess

	fset := token.NewFileSet()
	hmap := make(map[int][]string)

	//load fset

	f, err := parser.ParseFile(fset, filepath, nil, parser.ParseComments)

	if err != nil {
		return
	}

	//make struct obj

	travel := &Traveller{fset: fset, hmap: hmap}

	ast.Walk(travel, f) //pass in the travelling obj and the AST

	fmt.Print(travel.hmap)

	//something
	// varOne := Variable{VarName: "Pluto", LineNumber: 10}
	// varTwo := Variable{VarName: "bok", LineNumber: 29}

	// variables := Output{[]Variable{varOne, varTwo}}

	toWrite := Output{[]Variable{}}

	for key, value := range travel.hmap {
		lineNum := key
		varNames := value
		var varObj Variable = Variable{LineNumber: lineNum, VarNames: varNames}
		toWrite.Variables = append(toWrite.Variables, varObj)
	}

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
	if err := encoder.Encode(toWrite); err != nil {
		log.Fatal("Error encoding JSON:", err)
	}
	fmt.Print("Successfully wrote all variables to output JSON.")
}

//todo:
//1. you need to filter for variable assignments only, because stuff like "var x int" and "x = 1" cant both be counted, so PICK one
//2. maybe only try to pick out stuff that's actually not being used.
