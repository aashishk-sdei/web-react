import React, { useEffect, useRef } from 'react';
import Typeahead from '../Typeahead';
import { getDateString } from '../utils';
import { getSearchPeople } from './../../redux/actions/universalSearch'
import { v4 as uuidv4 } from 'uuid'
import { useSelector, useDispatch } from 'react-redux';
const SearchPeople = ({ field, form, getOptionDisabled = [], inputRef, ...props }) => {
    const handleChange = (val) => {
        if (!val?.name) {
            form.setFieldValue(`${field.name.split(".").shift()}.s`, "2")
        } else {
            if (form?.values?.matchExact) {
                form.setFieldValue(`${field.name.split(".").shift()}.s`, "0")
            }
        }
        if (props.freeSolo || val?.id) {
            form.setFieldValue(`${field.name}`, val)
        }
        props.selectPeople && props.selectPeople(val)
    }
    const dispatch = useDispatch()
    const eventRef = useRef();
    const pageRef = useRef(1);
    const prevHeight = useRef(0);
    const refId = useRef();
    const value = field.value || null
    const { people } = useSelector(state => state.search);
    useEffect(() => {
        if (inputRef) {
            inputRef.focus();
        }

        const delayDebounceFn = setTimeout(() => {
            if (field?.value?.name) {
                pageRef.current = 1;
                refId.current = uuidv4()
                dispatch(getSearchPeople(refId.current, pageRef.current, field?.value?.name));
            }
        }, 250)

        return () => {
            return clearTimeout(delayDebounceFn)
        }
    }, [field?.value?.name])

    const loadMore = () => {
        dispatch(getSearchPeople(refId.current, pageRef.current, field?.value?.name));
    }
    useEffect(() => {
        if (pageRef.current > 1) {
            eventRef.current.target.scrollTop = prevHeight.current
        }
    }, [people])
    return (
        <div className="flex mt-0 w-full">
            <Typeahead
                id={props.id}
                {...props}
                getOptionDisabled={getOptionDisabled}
                options={people}
                value={value?.name ? value : null}
                handleChange={handleChange}
                placeholder={props.placeholder ? props.placeholder : "Search Person"}
                disabled={props.disabled}
                highlight={!props.renderOption}
                extraRender={getDateString}
                open={props.open}
                type={props.type}
                serverPagination={
                    {
                        ListboxProps: {
                            onScroll: (e) => {
                                const listboxNode = e.currentTarget;
                                prevHeight.current = listboxNode.scrollHeight
                                if (listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight) {
                                    pageRef.current += 1;
                                    eventRef.current = e;
                                    loadMore()
                                }
                            }
                        }
                    }
                }

            />
        </div>
    );
}



export default SearchPeople;