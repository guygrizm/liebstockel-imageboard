import * as Vue from "./vue.js";
import Focus from "./focus.js";

Vue.createApp({
    components: {
        focus: Focus,
    },
    data: function () {
        return {
            images: [],
            title: "",
            username: "",
            description: "",
            image: null,
            selectedImageId: null,
            showMoreButton: true,
        };
    },
    mounted: async function () {
        const response = await fetch("/api/images");
        const data = await response.json();
        this.images = data;
    },
    methods: {
        async handleMoreImages() {
            const lowestIdOnScreen = this.images[this.images.length - 1].id;
            const awaitingData = await fetch(
                `/api/images/more/${lowestIdOnScreen}`
            );
            const data = await awaitingData.json();
            console.log("data visible", data[0]);
            const lowestIdData = data[0].lowestId;

            this.images = [...this.images, ...data];

            if (this.images[this.images.length - 1].id === lowestIdData) {
                this.showMoreButton = false;
            }
        },

        handleCloseFocus() {
            window.history.pushState({}, "", `/`);
            this.selectedImageId = null;
            window.history.pushState({}, "", `/`);
        },

        handleImageClick(image) {
            console.log("handle click test", image);
            this.selectedImageId = image;
            window.history.pushState({}, "", `/#${image}`);
        },

        handleChange(event) {
            event.preventDefault();
            console.log("handleChange running....");
            this.image = event.target.files[0];
        },
        async handleSubmit(event) {
            console.log("handleSubmit running");
            console.log("this.title: ", this.title);

            event.preventDefault();

            const formData = new FormData();
            formData.append("image", this.image);
            formData.append("title", this.title);
            formData.append("username", this.username);
            formData.append("description", this.description);

            const response = await fetch("/upload", {
                method: "POST",
                body: formData,
            });

            const newImage = await response.json();
            this.images = [newImage, ...this.images];
        },
    },
}).mount("#main");
