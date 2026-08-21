"""Flask app entrypoint: serves the frontend and registers the weather API."""

from flask import Flask, render_template

from routes.weather_routes import weather_bp


def create_app():
    app = Flask(__name__)
    app.register_blueprint(weather_bp)

    @app.route("/")
    def index():
        return render_template("index.html")

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
