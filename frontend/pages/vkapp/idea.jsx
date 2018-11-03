
import React from 'react'
import Page from '../../components/page'
import gate from '../../modules/gate'

export default class Screen extends React.Component {
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
        }
    }

    async componentDidMount () {
        const me = await gate.ask('/users/me');
        this.setState({me});

        const idea = await gate.ask('/ideas/' + this.idea_id);
        this.setState({idea});

        if ('undefined' !== typeof window) {
            this.setState({search: window.location.search.split('&hash=')[0] + '&hash='});
        }
    }

    render () {
        const {me, idea, search} = this.state;
        const vkInfo = me && me.vkInfo || {};

        return (
            <Page>
                <a href={'/vkapp' + search}>к списку</a><br />
                {idea && (
                    <div>
                        <div>
                            <br />
                            {idea.parentIdeas && idea.parentIdeas.map((o, n) => (
                                <a key={n} href={'/vkapp/idea' + search + '&idea_id=' + o._id}> {o.title} -> </a>
                            ))}
                        </div>
                        <h2>{idea.title}</h2>
                        <p>{idea.description}</p>
                        <div>
                            Автор: {idea.author}<br />
                            Дата содания: {(new Date(idea.createdAt || 0)).toISOString()}<br />
                        </div>
                        <br />
                        <div>
                            <button>Голосовать За</button>
                            <button>Голосовать Против</button>
                            <button>Пропустить</button>
                        </div>
                        <br />
                        <div>
                            За: {idea.votesPlus}<br />
                            Против: {idea.votesMinus}<br />
                            Воздержались: {idea.skips}<br />
                            Всего просмотров: {idea.views}<br />
                        </div>
                        
                        <h3>Аргументы за ({idea.ideasPlusCount})</h3>
                        {idea.ideasPlus && idea.ideasPlus.map((o, n) => (
                            <div key={n}>
                                <a href={'/vkapp/idea' + search + '&idea_id=' + o._id}>{o.title}</a>
                            </div>
                        ))}
                        <a href={'/vkapp/idea-add' + search + `&parent_idea_id=${idea._id}&idea_type=3`}>[добавить]</a><br />
                        
                        <h3>Аргументы против ({idea.ideasMinusCount})</h3>
                        {idea.ideasMinus && idea.ideasMinus.map((o, n) => (
                            <div key={n}>
                                <a href={'/vkapp/idea' + search + '&idea_id=' + o._id}>{o.title}</a>
                            </div>
                        ))}
                        <a href={'/vkapp/idea-add' + search + `&parent_idea_id=${idea._id}&idea_type=4`}>[добавить]</a><br />
                        
                        <h3>Комментарии ({idea.commentsCount})</h3>
                        {idea.comments && idea.comments.map((o, n) => (
                            <div key={n}>
                                <a href={'/vkapp/idea' + search + '&idea_id=' + o._id}>{o.title}</a>
                            </div>
                        ))}
                        <a href={'/vkapp/idea-add' + search + `&parent_idea_id=${idea._id}&idea_type=1`}>[добавить]</a><br />
                        
                        <h3>Альтернативы ({idea.alternativesCount})</h3>
                        {idea.alternatives && idea.alternatives.map((o, n) => (
                            <div key={n}>
                                <a href={'/vkapp/idea' + search + '&idea_id=' + o._id}>{o.title}</a>
                            </div>
                        ))}
                        <a href={'/vkapp/idea-add' + search + `&parent_idea_id=${idea._id}&idea_type=2`}>[добавить]</a><br />
                        
                        <h3>Планы реализации ({idea.implementationsCount})</h3>
                        {idea.implementations && idea.implementations.map((o, n) => (
                            <div key={n}>
                                <a href={'/vkapp/idea' + search + '&idea_id=' + o._id}>{o.title}</a>
                            </div>
                        ))}
                        <a href={'/vkapp/idea-add' + search + `&parent_idea_id=${idea._id}&idea_type=5`}>[добавить]</a><br />
                    </div>
                )}
            </Page>
        );
    }
}
