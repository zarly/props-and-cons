import Vue from 'vue'
import IdeaItem from '@/components/idea_item'
import idea from '../mocks/idea'

describe('idea_item.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(IdeaItem);
    const vm = new Constructor({propsData: {idea}}).$mount();
    expect(vm.$el.querySelector('.title').textContent).toEqual(idea.title)
  })
});
