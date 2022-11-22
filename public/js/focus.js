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
            
            <section>
                <img :src="image.url" class="pop-img"/>
            </section>
            <section>
                <button @click="handleCloseClick" class="closeButton desktopButton">×</button>
                <h2>{{ image.title }}</h2>
                <h3>Posted by {{ image.username }}</h3>
                <h4>Created at: {{ image.created_at }}</h4>
                <p>Description:</p>
                <p>{{ image.description}}</p>
                <comments :id="imageId"></comments>
            </section>
            
        </div>
        
        `,
};

export default Focus;
