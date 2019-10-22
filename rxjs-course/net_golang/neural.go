package main

import (
	"api-herobrine-go/helpers"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/NOX73/go-neural"
	"github.com/NOX73/go-neural/learn"
	"github.com/NOX73/go-neural/persist"
)

type NNContext struct {
	neural *neural.Network
}

func main() {
	app := &NNContext{neural: loadNetwork()}
	go app.LearnNetwork()
	app.testNetwork()
	http.HandleFunc("/", app.Default)
	log.Println("Go!")
	http.ListenAndServe(":3000", nil)

}

const (
	mozgFile   = "mozgFile.json"
	speed      = 0.1
	tranerFile = "tranerFile.json"
)

type Sample struct {
	In  []float64 `json:"in"`
	Out []float64 `json:"out"`
}
type Total struct {
	Learn []float64
}

func (t *Total) Add(l float64) {
	t.Learn = append(t.Learn, l)
}
func (t *Total) Replace(l float64) {
	t.Learn = []float64{l}
}
func (t *Total) GetTotal() float64 {
	r := float64(0)
	for _, v := range t.Learn {
		r += v
	}
	return r / float64(len(t.Learn))
}

func AddSample(info Sample) Sample {
	d := loadSample()
	d = append(d, info)
	j, _ := json.Marshal(d)
	err := ioutil.WriteFile(tranerFile, j, 0644)
	if err != nil {
		panic(err)
	}
	return info
}

func (s *NNContext) Calculate(weidth Sample) Sample {
	weidth.Out = s.neural.Calculate(weidth.In)
	return weidth
}
func Recommendation(res []float64) int {
	for k, v := range res {
		if v > 0.8 {
			return k
		}
	}
	return 0
}
func (n *NNContext) testNetwork() {
	// i := 5
	log.Println("--------------------------------------")
	samples := loadSample()
	c := 0
	for _, s := range samples {
		res := n.neural.Calculate(s.In)
		finish := false
		for k, v := range res {
			if v+s.Out[k] > 1.99 {
				finish = true
			}
		}
		if !finish {
			c++
		}
		// log.Printf("Пойдем бухать => %s, а ожидаем %s \t %.3f \t\t %v",total(res[0]),total(s.Out[0]),e, res)
	}
	helpers.Info("%-10s | %d", "неверных ответов", c)
}
func (n *NNContext) LearnNetwork() {
	samples := loadSample()
	total := Total{}
	total.Add(learn.Evaluation(n.neural, samples[0].In, samples[0].Out))
	helpers.Info("%-10s", "Начало обучения")
	for total.GetTotal() > 0.01 {
		for _, s := range samples {
			if s.IsOut() && s.IsIn() {
				learn.Learn(n.neural, s.In, s.Out, speed)
				total.Add(learn.Evaluation(n.neural, s.In, s.Out))
			} else {
				helpers.Info("Внимание пустые данные")
			}
		}
		// n.saveNetwork()
		helpers.Info("%-5s | %f", "Уровень ошибки", total.GetTotal())
	}
	n.saveNetwork()
	helpers.Info("%-10s | %.2f", "Результат обучения", total.GetTotal())
}
func (n *NNContext) LearnOne(s Sample) {
	learn.Learn(n.neural, s.In, s.Out, speed)
	n.saveNetwork()
}

func loadSample() []Sample {
	s := []Sample{}
	b, _ := ioutil.ReadFile(tranerFile)
	json.Unmarshal([]byte(b), &s)
	return s
}

func loadNetwork() *neural.Network {
	if !fileExists(mozgFile) {
		if fileCreate(mozgFile) {
			createNetwork()
		} else {
			return nil
		}
	}
	return persist.FromFile(mozgFile)
}

func (s *NNContext) saveNetwork() {
	persist.ToFile(mozgFile, s.neural)
}
func fileExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}
func fileCreate(filename string) bool {
	f, err := os.Create(filename)
	if err != nil {
		helpers.Info("fileCreate %v", err)
		return false
	}
	defer f.Close()
	return true
}

/*
 * Нейросеть классификации приоритета терминалов
 * 15 входящих нейронов 4 исходящих нейронов
 */
func createNetwork() {
	n := neural.NewNetwork(625, []int{625, 1250, 10})
	n.RandomizeSynapses()
	persist.ToFile(mozgFile, n)
}
func (s *NNContext) Weigth(w http.ResponseWriter, r *http.Request) {
	setupResponse(&w)
	result := Welcom{
		"Neural Network Api",
		1,
	}
	switch r.Method {
	case "GET":
		Write(persist.FromFile(mozgFile), w)
		break
	case "OPTIONS":
		Write(result, w)
		break
	default:
		NotAllowed(w)
	}
}
func (s *NNContext) Default(w http.ResponseWriter, r *http.Request) {
	setupResponse(&w)
	result := Welcom{
		"Neural Network Api",
		1,
	}
	sample := Sample{[]float64{}, []float64{}}
	switch r.Method {
	case "GET":
		Write(s.neural, w)
		break
	case "OPTIONS":
		Write(result, w)
		break
	case "POST":
		// Decode the JSON in the body and overwrite 'tom' with it
		d := json.NewDecoder(r.Body)
		err := d.Decode(&sample)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
		if sample.Valid() {
			if sample.IsOut() {
				for k, v := range sample.Out {
					if v > 0 {
						helpers.Info("Учим %v", k)
					}
				}
				s.LearnOne(sample)
			}
			as := s.Calculate(sample)
			Write(as, w)
			break
		}
		BadRequest("Данные не полные", w)
		break
	default:
		NotAllowed(w)
	}
}

func setupResponse(w *http.ResponseWriter) {
	(*w).Header().Set("Content-Type", "application/json")
	(*w).Header().Set("Accept", "application/json")
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
}

func Write(v interface{}, w http.ResponseWriter) {
	j, _ := json.Marshal(v)
	w.Write(j)
}
func NotAllowed(w http.ResponseWriter) {
	v := make(map[string]string)
	v["error"] = "Метод не допустим"
	j, _ := json.Marshal(v)
	w.WriteHeader(http.StatusMethodNotAllowed)
	w.Write(j)
}

func ServerError(err string, w http.ResponseWriter) {
	v := make(map[string]string)
	v["error"] = err
	j, _ := json.Marshal(v)
	w.WriteHeader(http.StatusInternalServerError)
	w.Write(j)
}
func BadRequest(e string, w http.ResponseWriter) {
	v := make(map[string]string)
	v["error"] = e
	j, _ := json.Marshal(v)
	w.WriteHeader(http.StatusBadRequest)
	w.Write(j)
}
func NotFound(w http.ResponseWriter) {
	v := make(map[string]string)
	v["error"] = "Данных не обнаружено"
	j, _ := json.Marshal(v)
	w.WriteHeader(http.StatusNotFound)
	w.Write(j)
}

type Welcom struct {
	Name    string `json:"name"`
	Version int64  `json:"version"`
}

func (s *Sample) Valid() bool {
	return len(s.In) == 625 && len(s.Out) == 10
}
func (s *Sample) IsOut() bool {
	for _, v := range s.Out {
		if v > 0 {
			return true
		}
	}
	return false
}
func (s *Sample) IsIn() bool {
	for _, v := range s.In {
		if v > 0 {
			return true
		}
	}
	return false
}
