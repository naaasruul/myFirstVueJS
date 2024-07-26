export default {
    template:`
    <div class='container mt-5'>
    <h1>Leaderboard {{mode}}</h1>
    <nav class="nav">
        <router-link to='/leaderboards/easy' class='nav-link'>Easy</router-link>
        <router-link to='/leaderboards/difficult' class='nav-link'>Difficult</router-link>
    </nav>

    <div class='row'>
        <div class='col-6'>
            <table class='table table-bordered'>
                <thead>
                 <td>#</td>
                 <td>Name</td>
                 <td>Move</td>
                </thead>

                <tr v-for='(rank, index) in moveRanking'>
                    <td>{{index + 1}}</td>
                    <td>{{rank.name}}</td>
                    <td>{{rank.val}}</td>
                </tr>
            </table>
        </div>

        <div class='col-6'>
             <table class='table table-bordered'>
                <thead>
                 <td>#</td>
                 <td>Name</td>
                 <td>Time</td>
                </thead>

                <tr v-for='(rank, index) in timeRanking'>
                    <td>{{index + 1}}</td>
                    <td>{{rank.name}}</td>
                    <td>{{format(rank.val)}}</td>
                </tr>
            </table>
        </div>
    </div>
    <div>
    <button @click="goToHome">Exit</button>
    </div>

    </div>
    `,
    data() {
        return {
            mode:null,
            timeRanking:[],
            moveRanking:[],
        }
    },
    methods: {
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
        loadData(){
            this.mode = this.$route.params.mode
        var keyTimer = `timescore_${this.mode}`;
        var keyMove = `movescore_${this.mode}`;

        this.timeRanking = JSON.parse(localStorage.getItem(keyTimer)) || [];
        this.moveRanking = JSON.parse(localStorage.getItem(keyMove)) || [];
        }
        ,goToHome(){
            localStorage.removeItem('gameState')
            this.$router.push('/')
        }
    },
    mounted() {
        this.loadData()
    },
    watch: {
        $route(to,from){
            this.loadData()
        }
    },
}