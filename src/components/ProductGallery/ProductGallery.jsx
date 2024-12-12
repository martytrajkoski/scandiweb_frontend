import React, { Component } from 'react';

class ProductGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPhoto: 0,
    };
  }

  nextPhoto = () => {
    this.setState((prevState) => ({
      selectedPhoto:
        prevState.selectedPhoto === this.props.photos.length - 1
          ? 0
          : prevState.selectedPhoto + 1,
    }));
  };

  prevPhoto = () => {
    this.setState((prevState) => ({
      selectedPhoto:
        prevState.selectedPhoto === 0
          ? this.props.photos.length - 1
          : prevState.selectedPhoto - 1,
    }));
  };

  selectPhoto = (index) => {
    this.setState({ selectedPhoto: index });
  };

  render() {
    const { photos } = this.props;
    const { selectedPhoto } = this.state;

    return (
      <div className="product-gallery">
        <div className="photo-list">
          {photos.map((photo, index) => (
            <img
              key={index}
              src={photo}
              alt={`Product ${index + 1}`}
              className={`thumbnail ${selectedPhoto === index ? 'selected' : ''}`}
              onClick={() => this.selectPhoto(index)}
            />
          ))}
        </div>

        <div className="photo-display">
          <button className="prev-button" onClick={this.prevPhoto}>
            &#60;
          </button>
          <img
            src={photos[selectedPhoto]}
            alt={`Selected product ${selectedPhoto + 1}`}
            className="selected-photo"
          />
          <button className="next-button" onClick={this.nextPhoto}>
            &#62;
          </button>
        </div>
      </div>
    );
  }
}

export default ProductGallery;
