import React from 'react'

export const NameAndDesignation = ({ nameAndDesignation, enrollAndLocation }) => {
    return (
        <>
            <div className="mt-2">
                <strong>Name & Designation</strong>: <span>{nameAndDesignation}</span>
            </div>
            <div>
                <strong>Enroll, Location</strong>: <span>{enrollAndLocation}</span>
            </div>
            <hr />
        </>
    )
}
