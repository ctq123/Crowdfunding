<template>
  <div id="app">
    <Header
      :numCorrect="numCorrect"
      :numTotal="numTotal"
    />
    <!-- <b-container class="bv-example-row">
      <b-row>
        <b-col sm="12" offset-sm="0" md="8" offset-md="2" lg="6" offset-lg="3">
          <QuestionBox
            v-if="questions.length > 0"
            :currentQuestion="questions[index]"
            :next="next"
            :increment="increment"
          />
        </b-col>
      </b-row>
    </b-container> -->

    <CrowdFund />
  </div>
</template>

<script>
import Header from './components/Header.vue'
// import QuestionBox from './components/QuestionBox.vue'
import CrowdFund from './components/CrowdFund.vue'

export default {
  name: 'app',
  components: {
    Header,
    // QuestionBox,
    CrowdFund,
  },
  data() {
    return {
      questions: [],
      index: 0,
      numCorrect: 0,
      numTotal: 0
    }
  },
  methods: {
    next() {
      if(this.index < this.questions.length - 1){
         this.index++
      }
    },
    increment(isCorrect){
      if(isCorrect) {
        this.numCorrect++
      }
      this.numTotal++
    }
  },
  mounted() {
    fetch("https://opentdb.com/api.php?amount=10&category=27&difficulty=hard&type=multiple", {
      method: 'GET'
    })
      .then((response) => {
        return response.json()
      })
      .then((jsonData) => {
        this.questions = jsonData.results
      })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
