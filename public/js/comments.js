const Comments = {
    data() {
        return {
            comments: [],
            username: "",
            comment: "",
        };
    },
    props: {
        id: {
            type: Number,
        },
    },
    mounted: async function () {
        console.log("this id", this.id);
        const response = await fetch("/api/comments/" + this.id);
        const data = await response.json;
        this.comments = data;
    },
    methods: {
        handleSubmitComment(event) {
            event.preventDefault;
            fetch("/api/comment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: this.username,
                    comment: this.comment,
                    image_id: this.id,
                }),
            });
        },
    },
    template: `
    <h2>Add a comment</h2>
    <form @submit.prevent.default="handleSubmitComment">
        <label for="username">User Name</label>
        <input v-model="username" type="text" name="username" id="username" placeholder="User Name" maxlength="15">
        <label for="comment">Comments</label>
        <input v-model="comment" type="text" name="comment" id="comment" placeholder="Comment" maxlength="30">
        <button type="submit">Submit</button>
    </form>
    <ul class="comments">
        <li v-for="comment of comments">
            <h4>{{comment.username}} says:</h4>
            <p>{{comment.comment}}</p>
        </li>
    </ul>
    `,
};

export default Comments;
