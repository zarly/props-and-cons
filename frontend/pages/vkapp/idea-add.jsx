
import Component from '../../components/component'
import Page from '../../components/page'
import gate from '../../modules/gate'

export default class Screen extends Component {
    constructor () {
        super();
        this.state = {
            me: null,
            idea: null,
            search: '',
        };

        if ('undefined' !== typeof window) {
            const url = new URL(location.href);
            this.idea_id = url.searchParams.get('idea_id');
            this.parent_idea_id = url.searchParams.get('parent_idea_id');
            this.idea_type = url.searchParams.get('idea_type');
        }
    }

    async componentDidMount () {
        const me = await gate.ask('/users/me');
        this.setState({me});

        if ('undefined' !== typeof window) {
            this.setState({search: window.location.search.split('&hash=')[0] + '&hash='});
        }
    }

    render () {
        const {me, search} = this.state;
        const vkInfo = me && me.vkInfo || {};

        return (
            <Page>
                <a href={'/vkapp' + search}>к списку</a><br />
                <h2>Добавить идею</h2>

                <form onSubmit={this.onSubmit.bind(this)}>
                    <input type="text" name="title" placeholder="Заголовок" /><br />
                    <textarea name="description" placeholder="Описание"></textarea><br />
                    <button type="submit">Отправить</button>
                </form>
            </Page>
        );
    }

    async onSubmit (e) {
        e.preventDefault();

        const {elements} = e.target;
        const query = {
            title: elements.title.value,
            description: elements.description.value,
            parentIdea: this.parent_idea_id || null,
            type: this.idea_type || 1,
        };

        const result = await gate.ask('/ideas', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(query),
        });

        location.href = '/vkapp/idea' + this.state.search + '&idea_id=' + result._id;
    }
}
