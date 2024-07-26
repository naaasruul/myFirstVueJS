export default {
    template:`
    <h1>Leaderboard {{mode}}</h1>
    `,
    data() {
        return {
            mode:null,
        }
    },
    methods: {
        
    },
    mounted() {
        this.mode = this.$route.params.mode
    },
}