package main

import (
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
)

// add a dict field and a fset field that can access line and column numbers
type MyVisitor struct {
	fset *token.FileSet
	hmap map[string]int
}

func (r MyVisitor) Visit(node ast.Node) ast.Visitor {
	if node == nil {
		return nil
	}
	fmt.Println(r.fset.Position(node.Pos()))
	if fn, ok := node.(*ast.FuncDecl); ok {
		fmt.Printf("Function foundar: %s\n", fn.Name.Name)
	}

	//NOTE: variabes are within GenDecl nodes, and GenDecl nodes have all the variables that are declared in a particular line
	// so there could be multiple, so you have to iterate through the Specs array that a GenDecl has

	if fn, ok := node.(*ast.GenDecl); ok {
		for _, spec := range fn.Specs { // Range over Specs (no need for manual index)
			if valSpec, isValueSpec := spec.(*ast.ValueSpec); isValueSpec { // Check for ValueSpec
				for _, name := range valSpec.Names { // Range over variable names
					fmt.Printf("This here is a variable: %s\n", name.Name)
				}
			}
		}
	}

	if assign, ok := node.(*ast.AssignStmt); ok {
		for _, lhs := range assign.Lhs {
			if ident, ok := lhs.(*ast.Ident); ok {
				fmt.Printf("Variable (short declare or assign): %s\n", ident.Name)
			}
		}
	}

	return r
}

func main() {
	fset := token.NewFileSet()

	src := `
package example

var globalX = 10

func Add(a, b int) int {
    var sum int = a + b
	lemon := 1
	y = 1
    return sum
}

func Subtr(a, b int) int {
    return a - b
}
`

	file, _ := parser.ParseFile(fset, "", src, parser.ParseComments)

	hmap := make(map[string]int)

	myStruc := MyVisitor{fset: fset, hmap: hmap}
	ast.Walk(myStruc, file)
}

func two() {

}

func one() {

	src := `package foo
	
				import (
					"fmt"
					"time"
				)
	
				func bar() {
					x := 1
					fmt.Println(time.Now())
				}`

	fset := token.NewFileSet() // so this thing kinda maps token positions in the code to the file locations (like the line and col numbers)

	//so like for every single node in the AST, you have a value that is mapped in the fset that tells the location
	f, err := parser.ParseFile(fset, "", src, parser.ImportsOnly)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Printf("%#v", f)

	ast.Print(fset, f)

	//NODE types in Go ASTs:
	// ast.File: Represents an entire source file
	// ast.FuncDecl: A function declaration
	// ast.BlockStmt: A block of statements (like a function body)
	// ast.AssignStmt: An assignment statement (like x := 10)
	// ast.DeclStmt: A declaration statement (like var x int)
	// ast.Ident: An identifier (variable name, function name, etc.)
}
