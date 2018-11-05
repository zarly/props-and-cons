
import {pd, mg, ft, cl} from '../../style/theme'
import Component from '../../components/component'
import Page from '../../components/page'
import Argument from '../../components/argument'
import gate from '../../modules/gate'
import ideaMock from '../../../server/dist/mocks/idea'

const argsBlockCSS = {
	background: cl.lt,
	border: `1px solid ${cl.mn}`,
	marginBottom: mg.m,
	padding: pd.m,
};


const ArgsTitle = (p) => <span style={{fontSize: ft.l, fontWeight: 'bold', color: cl.dk}}>{p.children}</span>;
const Row = (p) => <div style={{display: 'flex'}}>{p.children}</div>;
const PseudoIcon = () => <div style={{display: 'inline-block', width: '20px', height: '20px', background: cl.ct}} />;
const StatsIcon = (p) => <div style={{border: '1px solid #aaa', padding: pd.xs, margin: mg.xs}}>
		<PseudoIcon/>{p.value}
		<div style={{fontSize: ft.s}}>{p.label}</div>
	</div>;

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
        }
    }

    async componentDidMount () {
	    // const me = await gate.ask('/users/me');
	    // this.setState({me});
	    //
	    // const idea = await gate.ask('/ideas/' + this.idea_id);
	    // this.setState({idea});
	    this.setState({idea: ideaMock});

        if ('undefined' !== typeof window) {
            this.setState({search: window.location.search.split('&hash=')[0] + '&hash='});
        }
    }

    render () {
        const {idea, search} = this.state;

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
                            <button onClick={this.vote.bind(this, idea._id, 3)}>Голосовать За</button>
                            <button onClick={this.vote.bind(this, idea._id, 4)}>Голосовать Против</button>
                            <button onClick={this.vote.bind(this, idea._id, 2)}>Пропустить</button>
                        </div>
                        <br />
                        <Row>
	                        <StatsIcon label={'одобряют'}   value={idea.votesPlus} />
	                        <StatsIcon label={'возражают'}  value={idea.votesMinus} />
	                        <StatsIcon label={'пропустили'} value={idea.skips} />
			                <StatsIcon label={'увидели'}    value={idea.views} />
                        </Row>

	                    <div style={argsBlockCSS}>
		                    <ArgsTitle>Аргументы за ({idea.ideasPlusCount})</ArgsTitle>
		                    {idea.ideasPlus && idea.ideasPlus.map((o, n) => (
			                    <Argument key={n} idea={o} index={n + 1} linkSearch={search} />
		                    ))}
		                    <a href={'/vkapp/idea-add' + search + `&parent_idea_id=${idea._id}&idea_type=3`}>[добавить]</a>
	                    </div>

	                    <div style={argsBlockCSS}>
		                    <ArgsTitle>Аргументы против ({idea.ideasMinusCount})</ArgsTitle>
		                    {idea.ideasMinus && idea.ideasMinus.map((o, n) => (
			                    <Argument key={n} idea={o} index={n + 1} linkSearch={search} />
		                    ))}
		                    <a href={'/vkapp/idea-add' + search + `&parent_idea_id=${idea._id}&idea_type=4`}>[добавить]</a>
	                    </div>

	                    <div style={argsBlockCSS}>
		                    <ArgsTitle>Альтернативы ({idea.alternativesCount})</ArgsTitle>
		                    {idea.alternatives && idea.alternatives.map((o, n) => (
			                    <Argument key={n} idea={o} index={n + 1} linkSearch={search} />
		                    ))}
		                    <a href={'/vkapp/idea-add' + search + `&parent_idea_id=${idea._id}&idea_type=2`}>[добавить]</a>
	                    </div>

	                    <div style={argsBlockCSS}>
		                    <ArgsTitle>Планы реализации ({idea.implementationsCount})</ArgsTitle>
		                    {idea.implementations && idea.implementations.map((o, n) => (
			                    <Argument key={n} idea={o} index={n + 1} linkSearch={search} />
		                    ))}
		                    <a href={'/vkapp/idea-add' + search + `&parent_idea_id=${idea._id}&idea_type=5`}>[добавить]</a>
	                    </div>

	                    <div style={argsBlockCSS}>
		                    <ArgsTitle>Комментарии ({idea.commentsCount})</ArgsTitle>
		                    {idea.comments && idea.comments.map((o, n) => (
			                    <Argument key={n} idea={o} index={n + 1} linkSearch={search} />
		                    ))}
		                    <a href={'/vkapp/idea-add' + search + `&parent_idea_id=${idea._id}&idea_type=1`}>[добавить]</a>
	                    </div>
                    </div>
                )}
            </Page>
        );
    }

    async vote (ideaId, voteType) {
        const query = {ideaId, voteType};
        const res = await gate.ask('/vote', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(query),
        });

        const idea = await gate.ask('/ideas/' + this.idea_id);
        this.setState({idea});
    }
}
