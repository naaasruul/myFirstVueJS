export default {
    template:`
    <div class='container mt-5'>
        <h1>Game Page</h1>
        <div v-if='gameOver'>
        <h3>Game Over</h3>
                <h3>Mode = {{mode}}</h3>
        <h3>Move = {{move}} | <span v-if="userMoveRank < 6"> Rank #{{userMoveRank}}</span> <span v-else># You are not in ranking 👎</span></h3>
        <h3>Time = {{format(timer)}} | <span v-if="userTimeRank < 6 ">Rank #{{userTimeRank}}</span> <span v-else># You're stupid short term memory lost 🐟</span> </h3>

        <div v-if="userTimeRank < 6 || userMoveRank < 6">
        <input class="form-control mb-3" type="text" v-model="name">
        <button class='btn-primary btn' @click="submitPressed">Submit</button>
        </div>

        <div v-else>
        <button class='btn-primary btn' @click="restart">Restart Game</button>
        </div>
        </div>
        <div class="row" v-else>
        <div class="col-9" >
        <div class="row">

        <div class="col-4 main-card" v-for="(card,index) in cards" :key="index" @click="flipCard(index)" >
        <div class="card mb-3 card-front" :class="{'matched':card.matched}" v-if="card.flipped || card.matched" >
        <img class='img-fluid' :src="returnFilePath(card.val)" >
        </div>
        <div class=" bg-light p-5 card mb-3 text-center card-back" v-if="!card.flipped && !card.matched">
        <h1>?</h1>
        </div>
        </div>
        
        </div>
        </div>
        <div class="col-3">
        <h3>Mode = {{mode}}</h3>
        <h3>Move = {{move}}</h3>
        <h3>Time = {{format(timer)}}</h3>
        <h3>Match = {{match}}/{{total}} </h3>
        <button class="btn btn-primary" @click="pauseTimer">Pause</button>
        <button class="btn btn-primary" @click='restart'>Restart</button>
        <button class="btn btn-primary" @click='goToHome'>Exit</button>
        </div>
        </div>
    </div>

    `,
    data() {
        return {
          mode: null,
          move: 0,
          time: 0,
          match: 0,
          // cards:[0,0,1,1,2,2,3,3,4,4,5,5],
          total: 6,
          cards: [0, 0, 1, 1],
          flipIndices: [],
          gameOver: false,
          intervalId: null,
          timer: 0,
          pause: false,
          userTimeRank: null,
          userMoveRank: null,
          name:''
        };
    },
    methods: {
        goToHome(){
            localStorage.removeItem('gameState')
            this.$router.push('/')
        },
        returnFilePath(name){
            return `/image/${name}.png`
        },
        shuffleCard(array){
            for (let i = array.length-1; i--; i>0) {
                var j = Math.floor(Math.random()*i);
                // swap
                [array[i], array[j]] = [array[j],array[i]]
                
            }
            return array;
        },
        startTimer(){
            if(!this.pause){{
                this.intervalId = setInterval(() => {
                    this.timer++
                }, 1000);
            }}
        },

        stopTimer(){
            clearInterval(this.intervalId)
            this.intervalId = null
        },

        pauseTimer(){
            this.pause = true
            window.alert("Game Paused!")
            this.pause = false
        },

        restart(){
            localStorage.removeItem('gameState')
            this.stopTimer();
            this.mode = this.$route.params.mode;
            if (this.mode != "easy") {
              this.total = 12;
              this.cards = [0, 0, 1, 1, 2, 2];
            //   this.cards = [
            //     0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9,
            //   ];
            } else {
              this.total = 6;
              this.cards = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
            }
            this.cards = this.shuffleCard(
                this.cards.map((val) => ({
                    val: val,
                    flipped: false,
                    matched: false,
                }))
            );
            this.match = 0;
            this.move = 0;
            this.flipIndices = [];
            this.gameOver = false;
            this.timer = 0;
            this.pause = false;
        },

        format(time){
            var m = Math.floor(time/60)
            var s = time%60
            if(m<10){
                m = '0'+m
            }
            if(s<10){
                s = '0'+s
            }

            return `${m}:${s}`
        },

        saveState(){
            let gameState = {
              mode: this.mode,
              move: this.move,
              match: this.match,
              // cards:[0,0,1,1,2,2,3,3,4,4,5,5],
              total: this.total,
              cards: this.cards,
              flipIndices: this.flipIndices,
              timer: this.timer,
            };

            localStorage.setItem('gameState',JSON.stringify(gameState))
        },   

        submitPressed(){
            var keyTimer = `timescore_${this.mode}`;
            var keyMove = `movescore_${this.mode}`;

            var timeRanking = JSON.parse(localStorage.getItem(keyTimer)) || []
            var moveRanking = JSON.parse(localStorage.getItem(keyMove)) || [];

            if(this.userTimeRank <= 5){
                timeRanking.push({'name':this.name,'val':this.timer})
                timeRanking.sort((a,b)=>a.val-b.val)
                timeRanking = timeRanking.slice(0,5)
                // save dalam localStorage
                localStorage.setItem(keyTimer,JSON.stringify(timeRanking))
            }

            if(this.userMoveRank <= 5){
                moveRanking.push({'name':this.name,'val':this.move})
                moveRanking.sort((a,b)=>a.val-b.val)
                moveRanking = moveRanking.slice(0,5)
                // save dalam localStorage
                localStorage.setItem(keyMove,JSON.stringify(moveRanking))
            }

            this.$router.push(`/leaderboards/${this.mode}`)
        },

        flipCard(index){
            if(this.intervalId == null){
                this.startTimer()
            }

            if(this.cards[index].flipped || this.cards[index].matched || this.flipIndices.length === 2 ){
              return;
            }
            // console.log(this.cards[index])
            this.cards[index].flipped = true
            this.flipIndices.push(index)
            // console.log(this.flipIndices)
         
            if(this.flipIndices.length === 2){
                if(this.cards[this.flipIndices[0]].val == this.cards[this.flipIndices[1]].val){
                    // if matched
                    console.log('matched')
                    this.cards[this.flipIndices[0]].matched = true
                    this.cards[this.flipIndices[1]].matched = true
                    this.flipIndices = []
                    this.match++
                    this.move++
                    this.saveState()
                }else{
                    // if not matched
                    this.move++
                    console.log('unmatched')
                    setTimeout(()=>{
                        this.cards[this.flipIndices[0]].flipped = false
                        this.cards[this.flipIndices[1]].flipped = false
                        this.flipIndices = []
                    },1000)
                    this.saveState()
                }
            }

            if(this.cards.every(card => card.matched)){
                localStorage.removeItem('gameState')
                this.gameOver = true
                this.stopTimer()

                // retrieve localStorage
                var keyTimer = `timescore_${this.mode}`;
                var keyMove = `movescore_${this.mode}`;

                var timeRanking = JSON.parse(localStorage.getItem(keyTimer)) || []
                var moveRanking = JSON.parse(localStorage.getItem(keyMove)) || []

                if(timeRanking.length > 0){
                    this.userTimeRank = this.calculateRank(timeRanking, this.timer)
                }else{
                    
                    this.userTimeRank = 1
                }
                
                if(moveRanking.length > 0){
                    this.userMoveRank = this.calculateRank(moveRanking, this.move)
                }else{
                    this.userMoveRank = 1
                }

            }
            
        },
        calculateRank(ranking, val){
            let rank = 1
            for (let i = 0; i < ranking.length; i++) {
                if(val < ranking[i].val){

                    return rank
                }else{
                    rank++
                }
                
            }
            return rank


        }
    },
    mounted() {
        var gameState = JSON.parse(localStorage.getItem('gameState'))
        if(gameState){
            this.mode = gameState['mode']
              this.move = gameState['move']
              this.match = gameState['match']
              this.total = gameState['total']
              this.cards = gameState['cards']
              this.flipIndices = gameState['flipIndices']
              this.timer = gameState['timer']

              this.pause = true
              alert('Game is paused!')
              this.pause = false
        }else{
            this.mode = this.$route.params.mode
        if(this.mode != 'easy'){
            this.total = 12
            this.cards = [0, 0, 1, 1, 2, 2];
            // this.cards=[0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10]
        }
        this.cards = this.shuffleCard(
            this.cards.map((val) => ({
                val: val,
                flipped: false,
                matched: false,
            }))
        );
        console.log('after random:',this.cards)
        }
        
    },
}