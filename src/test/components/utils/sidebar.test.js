import { getSidebarTypeClass, handleIframeMessage, getFirstIndexClass, getScreenDropDownClass, handleIframeClick, personGetTextBold, handleResize} from "../../../components/utils/sidebar"
jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');
describe('Testcases for side bar type class', () => {
    it('match with firstname and lastname', () => {
        const mockCallBack = jest.fn();
        getSidebarTypeClass(mockCallBack, { value: 0  })
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
})

describe('Testcases for get First Index Classclass', () => {
    it('match with firstname and lastname', () => {
        const mockCallBack = jest.fn(); 
        getFirstIndexClass(mockCallBack, { value: 0 })
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
    it('match with firstname and lastname', () => {
        const mockCallBack = jest.fn();
        getFirstIndexClass(mockCallBack, { value: "" })
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
})


describe('Testcases for get Screen DropDown  class', () => {
    it('match with firstname and lastname', () => {
        const mockCallBack = jest.fn();
        getScreenDropDownClass(mockCallBack, { value: 0 })
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
   
})

describe('Testcases for get Screen person Get Text Bold  class', () => {
    it('match with firstname and lastname', () => {
        const mockCallBack = jest.fn(true);
        personGetTextBold(mockCallBack, ("ghf", { restrict: "ccv", field: ["xcv"] }, "xcv"))
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
})
describe('Testcases for handle Iframe Click', () => {
    
    
    it('match with handle Iframe Click one', () => {
        const mockCallBacktwo = jest.fn();
        handleIframeClick({ origin: "" })(mockCallBacktwo)
        expect(mockCallBacktwo.mock.calls.length).toEqual(0);
    });
    it('match with handle Iframe Click two', () => {
        const mockCallBacktwo = jest.fn();
        handleIframeClick({ data: { AdjustVisible: "false" } })(mockCallBacktwo)
        expect(mockCallBacktwo.mock.calls.length).toEqual(0);
    });
})

describe('Testcases for handle Resize  Click', () => {


    it('match with handle Resize Click', () => {
        const mockCallBack = jest.fn();
        handleResize(mockCallBack, { current: "" }, { current: "" }, "", "", "", "", "")
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
})

describe('Testcases for handle Iframe Message Click', () => {
    
    it('match with handle Resize Click one', () => {
        const mockCallBack = jest.fn(true);
        handleIframeMessage({ data: { StartClipping: "true" } })("", "", "", mockCallBack,"")
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
    it('match with handle Resize Click one', () => {
        const mockCallBack = jest.fn(false);
        handleIframeMessage({ data: { StartClipping: "false" } })("", "", "", mockCallBack, "")
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
    it('match with handle Resize Click two', () => {
        const mockCallBack = jest.fn(false);
        const mockCallBacktwo = jest.fn();
        handleIframeMessage({ data: { StartStory: "true" } })("", "", mockCallBacktwo, mockCallBack, "")
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
    it('match with handle Resize Click three', () => {
        const mockCallBack = jest.fn();
       
        handleIframeMessage({ data: { ShareTo: "Email" } })(mockCallBack, "", "", "", "")
        expect(mockCallBack.mock.calls.length).toEqual(0);
    });
})
