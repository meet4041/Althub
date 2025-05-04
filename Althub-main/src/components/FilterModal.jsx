import React from 'react'

const FilterModal = ({ closeModal, add, setAdd, skill, setSkill, handleFilter }) => {
  const handleCancel = () => {
    setAdd("");
    setSkill("");
    closeModal();
  }
  return (
    <>
      <div className="modal-wrapper" onClick={closeModal}></div>
      <div className="modal-container">
        <div className="edit-profile-header" onClick={closeModal}>
          <h2>Filter</h2>
          <i class="fa-solid fa-xmark close-modal"></i>
        </div>
        <div className="filter-details">
          <span>City</span>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={add}
            onChange={(e) => setAdd(e.target.value)}
          />
          <span>Skill</span>
          <input
            type="text"
            name="skills"
            placeholder="Skills"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
          <div className="buttons">
            <input
              type="button"
              value="Reset"
              className="action-button-cancel"
              onClick={handleCancel}
            />
            <input
              type="button"
              value="Apply"
              className="action-button-confirm"
              onClick={handleFilter}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterModal