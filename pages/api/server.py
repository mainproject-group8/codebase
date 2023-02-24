import os
import uuid
import tensorflow as tf
import numpy as np
from flask import Flask, request, jsonify, send_file, send_from_directory
# from tensorflow.keras.preprocessing.image import load_img, save_img, img_to_array, array_to_img
from flask_cors import CORS
from PIL import Image

UPLOAD_FOLDER = '/home/nrnjnnlkntn/Documents/S8/uploads'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
cors = CORS(app,resources={r"/*":{"origins":"*"}})
# Load the saved model

@app.route('/predict',methods=['POST'])
def upload():

    model =  tf.keras.models.load_model('/home/nrnjnnlkntn/Documents/S8/Saves')

    # Get the uploaded image from the request
    image_file = request.files['image']

    # Generate a unique filename for the uploaded image
    filename = f'{str(uuid.uuid4())}.jpg'

    # Save the image to disk
    image_file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    file_image = Image.open(os.path.join(app.config['UPLOAD_FOLDER'], filename)).resize((128,128))

    image_array = (np.array(file_image)/255.0).reshape(1,128,128,3)



    # # Run the model on the image
    prediction = model.predict(image_array)
    prediction = np.argmax(prediction)




    # Return the URL of the saved image as a JSON response
    # Convert the prediction to a string and send it back as a JSON response
    return jsonify({'url': f'/images/{filename}',
                    'prediction': str(prediction)})

# Define a Flask endpoint for serving uploaded images
@app.route('/images/<path:filename>')
def serve_image(filename):  
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)




if __name__=="__main__":
    app.run(debug=True)
    