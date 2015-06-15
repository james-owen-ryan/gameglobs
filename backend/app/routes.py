from flask import Flask, render_template, request


app = Flask(__name__, static_url_path='/gameglobs/static')


@app.route('/gameglobs')
def home():
    """Render the GameGlobs homepage."""
    return render_template('index.html')


@app.route('gameglobs/about')
def about():
    """Render the about page."""
    return render_template('about.html')


@app.route('gameglobs/faq')
def faq():
    """Render the FAQ page."""
    return render_template('faq.html')


@app.route('gameglobs/viz', methods=['POST'])
def viz():
    """Render the actual clustering visualization."""
    index_of_initial_k = request.form['indexOfSelectedKValue']
    return render_template('viz.html', index_of_initial_k=index_of_initial_k)


@app.route('gameglobs/viz')
def viz_without_pos():
    """In case someone tries to directly visit the viz URL, render the actual clustering visualization with k=2."""
    index_of_initial_k = 2
    return render_template('viz.html', index_of_initial_k=index_of_initial_k)

if __name__ == '__main__':
    # app.database = load_database()
    app.run(debug=False)
else:
    # app.database = load_database()
    pass

if not app.debug:
    import logging
    file_handler = logging.FileHandler('gameglobs.log')
    file_handler.setLevel(logging.WARNING)
    app.logger.addHandler(file_handler)
