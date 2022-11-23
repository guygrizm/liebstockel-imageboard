import Comments from "./comments.js";

const Focus = {
    components: {
        comments: Comments,
    },
    data() {
        return {
            image: [],
            imageId: this.id,
        };
    },

    props: {
        id: {
            type: Number,
        },
    },
    mounted: async function () {
        console.log("fetch ID", this.id);

        const response = await fetch("/api/" + this.id);
        const data = await response.json();
        if (!data) {
            this.$emit("close");
            return;
        }
        this.image = data;
    },
    methods: {
        handleCloseClick() {
            this.$emit("close");
            console.log("closeclick test");
        },
    },
    template: `
        <div class="focus">
         <button @click="handleCloseClick" class="closeButton desktopButton">Close</button>
           <div class="focus-content"> 

            <section>
                <img :src="image.url" class="pop-img"/>
            </section>
            <section>
               
                <h2>{{ image.title }}</h2>
                <h3>Posted by {{ image.username }}</h3>
                <h6>Created at: {{ image.created_at }}</h6>
                <h4>Description:</h4>
                <p>{{ image.description}}</p>
                <comments :id="imageId"></comments>
            </section>
            </div>
        </div>
        
        `,
};

export default Focus;
