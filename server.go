package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

type ResponseStruct struct {
	StatusCode   int         `json: "status_code"`
	Data         interface{} `json:"data,omitempty"`
	ErrorMessage string      `json:"error,omitempty"`
}

func main() {

	//CLIENT STUFF
	// response, baaad := http.Get("https://gobyexample.com")

	// if baaad != nil {
	// 	//
	// 	fmt.Println("li")
	// }

	// defer response.Body.Close() //do this to prevent resource leaks idk

	// scanner := bufio.NewScanner(response.Body)

	// for i := 0; scanner.Scan() && i < 5; i++ {
	// 	fmt.Print(scanner.Text())
	// }

	// fmt.Print(response.Body)

	http.HandleFunc("/api/health", health)
	http.HandleFunc("/api/metrics", metrics)
	http.HandleFunc("api/graphql", handleGraph)

	http.ListenAndServe(":8090", nil) //second arg tells to use the default routes we set up
}

func health(w http.ResponseWriter, req *http.Request) {
	// fmt.Print("Hit")
	// fmt.Fprintf(w, "brother")
	fmt.Println("Health requested.")
	responseBody := ResponseStruct{200, "bloodyhell", ""}
	_, err := json.Marshal(responseBody)
	if err == nil {
		//error handling
		fmt.Print("ss")
		responseBody.ErrorMessage = "Bad code dawg"
		responseBody.StatusCode = 400
	}
	blow, _ := json.Marshal(responseBody)
	w.Header().Set("Content-Type", "application/json")
	w.Write(blow)
}

func metrics(w http.ResponseWriter, req *http.Request) {
	fmt.Fprintln(w, "bye")
}

func handleGraph(w http.ResponseWriter, req *http.Request) {

}
