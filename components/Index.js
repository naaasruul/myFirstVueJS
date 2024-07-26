export default {
    template:`
      <div class='container'>
        <h1>Main Page</h1>
        <button @click="openEasyGame">Easy</button>
        <button @click="openDiffGame">Difficult</button>
        <button @click="openScore">Leaderboard</button>
    </div>
    `,
    data() {
        return {
            
        }
    },
    methods: {
        openEasyGame(){
            this.$router.push('/game/easy')
        },
        openDiffGame(){
            this.$router.push('/game/difficult')
        },
        openScore(){
            this.$router.push('/leaderboards/easy')
        }
    },
}