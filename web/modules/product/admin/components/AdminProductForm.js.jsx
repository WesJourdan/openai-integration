/**
 * Reusable stateless form component for Product
 */

// import primary libraries
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// import form components
import { SelectFromArray, TextInput, TextAreaInput } from '../../../../global/forms';

const AdminProductForm = ({
  cancelLink
  , formTitle
  , formType
  , handleFormChange
  , handleFormSubmit
  , product
}) => {

  // set the button text
  const buttonText = formType === "create" ? "Create Product" : "Update Product";

  // set the form header
  const header = formTitle ? <div className="formHeader"><h2> {formTitle} </h2><hr/></div> : <div/>;

  return (
    <div className="yt-container">
      <div className="yt-row center-horiz">
        <div className="form-container -slim">
          <form name="productForm" className="product-form" onSubmit={handleFormSubmit}>
            {header}
            <TextInput
              name="product.title"
              label="Title"
              value={product.title}
              change={handleFormChange}
              placeholder="Title (required)"
              required={true}
            />
            <TextAreaInput
              name="product.description"
              label="Description"
              value={product.description}
              change={handleFormChange}
              required={false}
              rows={3}
              placeholder="This is where the content goes..."
            />
            <div className="input-group">
              <div className="yt-row space-between">
                <Link className="yt-btn link" to={cancelLink}>Cancel</Link>
                <button className="yt-btn " type="submit" > {buttonText} </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

AdminProductForm.propTypes = {
  cancelLink: PropTypes.string.isRequired
  , formTitle: PropTypes.string
  , formType: PropTypes.string.isRequired
  , handleFormChange: PropTypes.func.isRequired
  , handleFormSubmit: PropTypes.func.isRequired
  , product: PropTypes.object.isRequired
}

AdminProductForm.defaultProps = {
  formTitle: ''
}

export default AdminProductForm;
