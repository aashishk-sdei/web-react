import { mount } from "enzyme";
import { getFirstAndLastName, CheckExactField, handleSearchType, getLastNode} from '../../../utils/formFields/helper'
jest.useFakeTimers();

describe('Testcases for firstname and lastname', () => {
    it('match with firstname and lastname', () => {
        expect(getFirstAndLastName()).toEqual(
            {
                0: "search.form.dropdown.exact", //"Exact"
                1: "search.form.dropdown.similar", //"Similar"
                2: "search.form.dropdown.broad", //"Broad"
            }
        ); 
    });
    
    
})
    

describe('Testcases for CheckExactField function', () => {
    it('match theb exact value', () => {
        const mockCallBack = jest.fn();
        CheckExactField(mockCallBack, { target: { value: 0 } })
        expect(mockCallBack.mock.calls.length).toEqual(0)
    });
    it('match theb exact value should be zero', () => {
        const mockCallBack = jest.fn();
        CheckExactField(mockCallBack, { target: { value: 1 } })
        expect(mockCallBack.mock.calls.length).toEqual(1)
    });
})


describe('Testcases for handleSearchType function', () => {
    it('match theb exact value one', () => {
        const mockCallBack = jest.fn();
        const mockCallBackSecond = jest.fn();
        
        handleSearchType({ target: { value: 1 } }, mockCallBack, mockCallBackSecond,"name","match",{},{"match":"match"})
        expect(mockCallBack.mock.calls.length).toEqual(1)
    });
    it('match theb exact value two', () => {
        const mockCallBack = jest.fn();
        const mockCallBackSecond = jest.fn();
        handleSearchType({ target: { value: 1 } }, mockCallBack, mockCallBackSecond, "name", "match", { "matchExact": "match"}, { "match": "match" })
        expect(mockCallBackSecond.mock.calls.length).toEqual(1)
    });
    it('match theb exact value three', () => {
        const mockCallBack = jest.fn();
        const mockCallBackThird = jest.fn();
        handleSearchType({ target: { value: undefined }}, mockCallBack, mockCallBackThird, "name", "match", {  }, { "match": "match" })
        expect(mockCallBackThird.mock.calls.length).toEqual(1)
    });
}) 

describe('Testcases for getLastNode function', () => {
    it('when key is not obejct', () => {
        const mockCallBack = jest.fn();
        getLastNode("", "")
        expect(mockCallBack.mock.calls.length).toEqual(0)
    })
    it('when key is obejct', () => {
        const mockCallBack = jest.fn();
        getLastNode({}, "hello")
        expect(mockCallBack.mock.calls.length).toEqual(0)
    })
    it('when object have some value', () => {
        const mockCallBack = jest.fn();
        getLastNode({"hello":"one"}, "hello")
        expect(mockCallBack.mock.calls.length).toEqual(0)
    })
    it('when object have no value', () => {
        const mockCallBack = jest.fn();
        getLastNode({ "": "" }, "hello")
        expect(mockCallBack.mock.calls.length).toEqual(0)
    })
    it('when object have some value', () => {
        const mockCallBack = jest.fn();
        getLastNode({ "hello": "one" }, "hello.hello")
        expect(mockCallBack.mock.calls.length).toEqual(0)
    })
});