import React from 'react';
import Typography from "./../../../../components/Typography";
import { Field, } from 'formik'
const Category = ( ) => {

    const categories = [
        "Achievements",
        "Attributes",
        "Career",
        "Challenges", 
        "Education",
        "Health",
        "Hobbies",
        "Immigration",
        "Memories",
        "Military",
        "Possessions",
        "Relationships",
        "Religion",
        "Sports"
    ]   
    return <div className="story-box add-category-box">
        <div className="story-body">
            <div className="story-title mb-4">
                <h2><Typography text="secondary" size={32} weight="lyon-medium">What categories apply?</Typography></h2>
            </div>
            <div>
                <div className="smm:mb-1.5 lg:mb-11">
                    <p className="text-sm mb-6">Select one or more. This helps to organize your stories.</p>
                    <div className="categories">
                        {categories.map((cat, cIndex) =>
                            <label key = {cIndex} className="cat-button group">
                                <Field type="checkbox" name="storyCategories" value={cat} />
                                <span className="label">{cat}</span>
                            </label>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Category