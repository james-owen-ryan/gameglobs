import csv
from flask import Flask, render_template, request


app = Flask(__name__)


@app.route('/gameglobs')
def home():
    """Render the GameGlobs homepage."""
    return render_template('index.html')


@app.route('/gameglobs/about')
def about():
    """Render the about page."""
    return render_template('about.html')


@app.route('/gameglobs/faq')
def faq():
    """Render the FAQ page."""
    return render_template('faq.html')


# @app.route('/viz=<initial_k>')
# def viz(initial_k):
#     """Render the actual clustering visualization."""
#     all_k_values = [
#         2, 3, 4, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90,
#         100, 125, 150, 175, 200, 250, 300, 400, 500, 600,
#         700, 800, 900, 1000, 1250, 1500, 2000, 2500
#     ]
#     index_of_initial_k = all_k_values.index(int(initial_k))
#     return render_template('viz.html', index_of_initial_k=index_of_initial_k)


@app.route('/gameglobs/viz', methods=['POST'])
def viz():
    """Render the actual clustering visualization."""
    index_of_initial_k = request.form['indexOfSelectedKValue']
    return render_template('viz.html', index_of_initial_k=index_of_initial_k)


@app.route('/gameglobs/viz')
def viz_without_pos():
    """In case someone tries to directly visit the viz URL, render the actual clustering visualization with k=2."""
    index_of_initial_k = 2
    return render_template('viz.html', index_of_initial_k=index_of_initial_k)


@app.route('/findByTitle=<selected_game_title>')
def open_page_given_game_title(selected_game_title):
    if any(g for g in app.database if g.title.lower() == selected_game_title.lower()):
        selected_game = next(g for g in app.database if g.title.lower() == selected_game_title.lower())
        return render_template('game.html', game=selected_game)
    else:
        # The game title/arbitrary query that the user typed in does not match
        # any game in our database, so keep displaying the home page, but note this
        return render_template('index.html', entered_unknown_game=True)


@app.route('/games/<selected_game_id>')
def open_page_given_game_id(selected_game_id):
    """Render the GameNet entry for a user-selected game."""
    selected_game = app.database[int(selected_game_id)]
    return render_template('game.html', game=selected_game)


@app.route('/game_idea', methods=['POST'])
def generate_entry_for_game_idea_from_gamesage():
    """Generate and render a GameNet entry for a GameSage query."""
    idea_text = request.form['user_submitted_text']
    related_games_str = request.form['most_related_games_str']
    unrelated_games_str = request.form['least_related_games_str']
    game_idea = GameIdea(
        idea_text=idea_text, related_games_str=related_games_str, unrelated_games_str=unrelated_games_str
    )
    # Set the title and year of each entry in the game idea's un/related games listings
    for entry in game_idea.related_games+game_idea.unrelated_games:
        title = app.database[int(entry.game_id)].title
        year = app.database[int(entry.game_id)].year
        entry.set_game_title_and_year(title=title, year=year)
    return render_template('gameIdea.html', game_idea=game_idea)


def load_database():
    """Load the database of game representations from a TSV file."""
    database = []
    with open('static/games_metadata.tsv', 'r') as tsvfile:
        reader = csv.reader(tsvfile, delimiter='\t')
        for row in reader:
            game_id, title, year, platform, wiki_url, wiki_summary, related_games_str, unrelated_games_str = row
            game_object = (
                Game(game_id, title, year, platform, wiki_url, wiki_summary, related_games_str, unrelated_games_str)
            )
            database.append(game_object)
    # Now that all the games have been read in, allow each game's un/related-games entries to be
    # attributed game titles and years via lookup into the database that is now fully populated
    for game in database:
        for entry in game.related_games+game.unrelated_games:
            title = database[int(entry.game_id)].title
            year = database[int(entry.game_id)].year
            entry.set_game_title_and_year(title=title, year=year)
    return database

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
