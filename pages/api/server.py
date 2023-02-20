import tensorflow as tf
import numpy as np
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load the saved model
model = tf.saved_model.load('/home/nrnjnnlkntn/Documents/S7/main-project/Saves')


# Define a Flask endpoint for receiving image files and making predictions
@app.route('/predict', methods=['POST'])
def predict():
    # Get the uploaded image from the request
    image_file = request.files['image']
    

    # Load the image using TensorFlow
    image = tf.keras.preprocessing.image.load_img(image_file, target_size=(224, 224))
    image = tf.keras.preprocessing.image.img_to_array(image)
    image = np.expand_dims(image, axis=0)

    # Run the model on the image
    prediction = model.predict(image)
    prediction = np.argmax(prediction)

    # Convert the prediction to a string and send it back as a JSON response
    return jsonify({'prediction': str(prediction)})

if __name__=="__main__":
    app.run(debug=True)
    