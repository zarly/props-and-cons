
import '../style/vkapp.less'
import Component from '../components/component'
import Page from '../components/page'
import pages from '.';
import gate from '../modules/gate'

const IDEAS_PER_PAGE_LIMIT = 10;

export default class Screen extends Component {
    constructor () {
        super();
        this.state = {
            me: null,
            ideas: [],
            ideasCount: 0,
            search: '',
        };

        if ('undefined' !== typeof window) {
            const url = new URL(location.href);
            this.idea_page = parseInt(url.searchParams.get('idea_page'), 10) || 1;
        }
    }

    async componentDidMount () {
        const me = await gate.ask('/users/me');
        this.setState({me});

        const ideasRes = await gate.ask('/ideas');
        this.setState({
            ideas: ideasRes.rows,
            ideasCount: ideasRes.count,
        });

        if ('undefined' !== typeof window) {
            this.setState({search: window.location.search.split('&hash=')[0] + '&hash='});
        }
    }

    render () {
        const {ideas, search} = this.state;
        const pages = this.getPageIndexes();
        const groupName = 'Название группы в которую добавили приложение';

        return (
            <Page className="IdeasPage">
                <div className="row">
                    <div>
                        <span className="anch crumb">{groupName}</span>
                    </div>
                    <div className="header-right">
                        <button className="btn-add-new" onClick={this.navigateAddIdea.bind(this)}>Добавить тему</button>
                    </div>
                </div>
                <a href={'/vkapp/profile' + search}>профиль пользователя</a>
                <h1>Идеи</h1>
                <table>
                    <tbody>
                        {ideas.map((o, n) => (
                            <tr key={n}>
                                <td><a href={'/vkapp/idea' + search + '&idea_id=' + o._id}>{o.title}</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <br />
                <div>
                    {pages.map((o, n) => (
                        <a key={n} href={'/vkapp' + search + '&idea_page=' + o}> {((n + 1) === this.idea_page) ? `[${o}]` : o} </a>
                    ))}
                </div>
            </Page>
        );
    }

    getPageIndexes () {
        const pages = [];
        for (let i = 0; i < this.state.ideasCount; i += IDEAS_PER_PAGE_LIMIT) {
            pages.push(Math.floor(i / IDEAS_PER_PAGE_LIMIT) + 1);
        }
        return pages;
    }

    navigateAddIdea () {
        location.href = '/vkapp/idea-add' + this.state.search;
    }
}
