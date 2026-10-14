from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "bt-latam-tec-simple")
db_path = os.path.join(os.path.dirname(__file__), "bt_latam_tec_simple.db")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", f"sqlite:///{db_path}")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class Usuario(db.Model):
    __tablename__ = "usuarios"
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Producto(db.Model):
    __tablename__ = "productos"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(180), nullable=False)
    brand = db.Column(db.String(120), nullable=False, default="BT LATAM TEC")
    category = db.Column(db.String(80), nullable=False, default="accesorios")
    price = db.Column(db.Float, nullable=False)
    original_price = db.Column(db.Float, nullable=True)
    icon = db.Column(db.String(20), nullable=True, default="💡")
    rating = db.Column(db.Float, nullable=False, default=4.5)
    reviews = db.Column(db.Integer, nullable=False, default=0)
    badge = db.Column(db.String(30), nullable=True, default="new")
    shipping = db.Column(db.String(120), nullable=True, default="Envío gratis")
    description = db.Column(db.String(500), nullable=True)
    creado_en = db.Column(db.DateTime, default=datetime.utcnow)

def current_user():
    uid = session.get("user_id")
    return Usuario.query.get(uid) if uid else None

@app.context_processor
def inject_user():
    return {"usuario_actual": current_user()}

def require_login():
    if not current_user():
        flash("Debes iniciar sesión para administrar productos.", "error")
        return False
    return True

def serialize_products():
    rows = Producto.query.order_by(Producto.id.asc()).all()
    out = []
    for p in rows:
        discount = 0
        if p.original_price and p.original_price > p.price:
            discount = round((1 - p.price / p.original_price) * 100)
        out.append({
            "id": p.id,
            "name": p.name,
            "brand": p.brand,
            "category": p.category,
            "price": p.price,
            "originalPrice": p.original_price or p.price,
            "icon": p.icon or "💡",
            "rating": p.rating,
            "reviews": p.reviews,
            "badge": p.badge or "new",
            "discount": discount,
            "shipping": p.shipping or "Envío gratis",
            "desc": p.description or "Producto tecnológico."
        })
    return out

@app.route("/")
@app.route("/index (1).html")
def index():
    return render_template("index (1).html", products_json=serialize_products())

@app.route("/register", methods=["POST"])
def register():
    nombre = request.form.get("nombre", "").strip()
    email = request.form.get("email", "").strip().lower()
    password = request.form.get("password", "").strip()
    confirm = request.form.get("confirm_password", "").strip()

    if not nombre or not email or not password or not confirm:
        flash("Completa todos los campos del registro.", "error")
        return redirect(url_for("index"))
    if password != confirm:
        flash("Las contraseñas no coinciden.", "error")
        return redirect(url_for("index"))
    if len(password) < 6:
        flash("La contraseña debe tener mínimo 6 caracteres.", "error")
        return redirect(url_for("index"))
    if Usuario.query.filter_by(email=email).first():
        flash("Ese correo ya está registrado.", "error")
        return redirect(url_for("index"))

    u = Usuario(nombre=nombre, email=email)
    u.set_password(password)
    db.session.add(u)
    db.session.commit()
    flash("Cuenta creada correctamente. Ahora inicia sesión.", "success")
    return redirect(url_for("index"))

@app.route("/login", methods=["POST"])
def login():
    email = request.form.get("email", "").strip().lower()
    password = request.form.get("password", "").strip()

    u = Usuario.query.filter_by(email=email).first()
    if u and u.check_password(password):
        session["user_id"] = u.id
        flash(f"Bienvenido {u.nombre}.", "success")
    else:
        flash("Correo o contraseña incorrectos.", "error")
    return redirect(url_for("index"))

@app.route("/logout")
def logout():
    session.clear()
    flash("Sesión cerrada correctamente.", "info")
    return redirect(url_for("index"))

@app.route("/crud")
def crud():
    if not require_login():
        return redirect(url_for("index"))
    productos = Producto.query.order_by(Producto.id.asc()).all()
    return render_template("crud.html", productos=productos)

@app.route("/productos/nuevo", methods=["POST"])
def producto_nuevo():
    if not require_login():
        return redirect(url_for("index"))

    name = request.form.get("name", "").strip()
    brand = request.form.get("brand", "").strip() or "BT LATAM TEC"
    category = request.form.get("category", "").strip() or "accesorios"
    price = request.form.get("price", "").strip()
    original_price = request.form.get("original_price", "").strip()
    icon = request.form.get("icon", "").strip() or "💡"
    rating = request.form.get("rating", "").strip() or "4.5"
    reviews = request.form.get("reviews", "").strip() or "0"
    badge = request.form.get("badge", "").strip() or "new"
    shipping = request.form.get("shipping", "").strip() or "Envío gratis"
    description = request.form.get("description", "").strip()

    if not name or not price:
        flash("Nombre y precio son obligatorios.", "error")
        return redirect(url_for("crud"))
    try:
        price = float(price)
        original_price = float(original_price) if original_price else None
        rating = float(rating)
        reviews = int(reviews)
    except ValueError:
        flash("Hay valores numéricos inválidos.", "error")
        return redirect(url_for("crud"))

    db.session.add(Producto(
        name=name, brand=brand, category=category, price=price,
        original_price=original_price, icon=icon, rating=rating,
        reviews=reviews, badge=badge, shipping=shipping,
        description=description or None
    ))
    db.session.commit()
    flash("Producto creado correctamente.", "success")
    return redirect(url_for("crud"))

@app.route("/productos/<int:producto_id>/editar", methods=["GET", "POST"])
def producto_editar(producto_id):
    if not require_login():
        return redirect(url_for("index"))

    p = Producto.query.get_or_404(producto_id)
    if request.method == "POST":
        try:
            p.name = request.form.get("name", "").strip()
            p.brand = request.form.get("brand", "").strip() or "BT LATAM TEC"
            p.category = request.form.get("category", "").strip() or "accesorios"
            p.price = float(request.form.get("price", "0"))
            op = request.form.get("original_price", "").strip()
            p.original_price = float(op) if op else None
            p.icon = request.form.get("icon", "").strip() or "💡"
            p.rating = float(request.form.get("rating", "4.5"))
            p.reviews = int(request.form.get("reviews", "0"))
            p.badge = request.form.get("badge", "").strip() or "new"
            p.shipping = request.form.get("shipping", "").strip() or "Envío gratis"
            p.description = request.form.get("description", "").strip() or None
        except ValueError:
            flash("Hay valores numéricos inválidos.", "error")
            return redirect(url_for("producto_editar", producto_id=producto_id))

        if not p.name:
            flash("El nombre es obligatorio.", "error")
            return redirect(url_for("producto_editar", producto_id=producto_id))

        db.session.commit()
        flash("Producto actualizado correctamente.", "success")
        return redirect(url_for("crud"))

    return render_template("editar_producto.html", producto=p)

@app.route("/productos/<int:producto_id>/eliminar", methods=["POST"])
def producto_eliminar(producto_id):
    if not require_login():
        return redirect(url_for("index"))
    p = Producto.query.get_or_404(producto_id)
    db.session.delete(p)
    db.session.commit()
    flash("Producto eliminado.", "info")
    return redirect(url_for("crud"))

def seed_data():
    if Producto.query.count() == 0:
        data = [{"name": "MacBook Pro M3 14\"", "brand": "Apple", "category": "laptops", "price": 1799.0, "original_price": 2199.0, "icon": "💻", "rating": 4.9, "reviews": 1240, "badge": "sale", "shipping": "Envío gratis", "description": "Chip M3, 18 GB RAM, 512 GB SSD. Rendimiento extraordinario para profesionales. Pantalla Liquid Retina XDR."}, {"name": "Samsung Galaxy S25 Ultra", "brand": "Samsung", "category": "smartphones", "price": 899.0, "original_price": 1199.0, "icon": "📱", "rating": 4.8, "reviews": 832, "badge": "sale", "shipping": "Envío gratis", "description": "Pantalla 6.8\" AMOLED, Snapdragon 8 Elite, 256 GB, cámara 200 MP. El flagship definitivo de 2025."}, {"name": "Sony WH-1000XM6", "brand": "Sony", "category": "audifonos", "price": 299.0, "original_price": 399.0, "icon": "🎧", "rating": 4.9, "reviews": 2105, "badge": "hot", "shipping": "Envío gratis", "description": "Cancelación de ruido líder del mercado, 30h batería, audio Hi-Res inalámbrico. Perfectos para trabajo y viaje."}, {"name": "LG OLED evo C4 65\"", "brand": "LG", "category": "tvs", "price": 1299.0, "original_price": 1799.0, "icon": "📺", "rating": 4.8, "reviews": 456, "badge": "sale", "shipping": "Instalación gratis", "description": "Panel OLED 4K 120Hz, Dolby Atmos, webOS, compatible con PS5 y Xbox. La mejor experiencia visual del hogar."}, {"name": "iPad Pro M4 11\"", "brand": "Apple", "category": "tablets", "price": 799.0, "original_price": 999.0, "icon": "📲", "rating": 4.7, "reviews": 698, "badge": "new", "shipping": "Envío gratis", "description": "Chip M4, pantalla Ultra Retina XDR OLED, Apple Pencil Pro. La tablet más potente del mundo."}, {"name": "PlayStation 5 Slim", "brand": "Sony", "category": "consolas", "price": 449.0, "original_price": 499.0, "icon": "🎮", "rating": 4.9, "reviews": 3210, "badge": "hot", "shipping": "Envío gratis", "description": "Consola PS5 edición Slim, SSD ultrarrápido, DualSense, compatible con todos los juegos PS4 y PS5."}, {"name": "DJI Mini 4 Pro", "brand": "DJI", "category": "drones", "price": 759.0, "original_price": 959.0, "icon": "🚁", "rating": 4.8, "reviews": 341, "badge": "new", "shipping": "Envío gratis", "description": "Drone 4K HDR, cámara rotación 360°, 34 min vuelo, omnidireccional. El mejor drone compacto de 2025."}, {"name": "Logitech MX Master 3S", "brand": "Logitech", "category": "accesorios", "price": 89.0, "original_price": 119.0, "icon": "🖱️", "rating": 4.8, "reviews": 4521, "badge": "sale", "shipping": "Envío gratis", "description": "Mouse ergonómico, scroll MagSpeed, compatible Windows/Mac/Linux. El favorito de creativos y programadores."}, {"name": "Dell XPS 15 OLED", "brand": "Dell", "category": "laptops", "price": 1499.0, "original_price": 1899.0, "icon": "💻", "rating": 4.7, "reviews": 387, "badge": "sale", "shipping": "Envío gratis", "description": "Intel Core i9, NVIDIA RTX 4070, pantalla OLED 3.5K táctil. Para creadores y desarrolladores exigentes."}, {"name": "iPhone 16 Pro Max", "brand": "Apple", "category": "smartphones", "price": 1199.0, "original_price": 1399.0, "icon": "📱", "rating": 4.9, "reviews": 5432, "badge": "hot", "shipping": "Envío gratis", "description": "Chip A18 Pro, cámara 48 MP Fusion, pantalla Super Retina XDR 6.9\", Action Button. El iPhone más avanzado."}, {"name": "Apple AirPods Pro 3", "brand": "Apple", "category": "audifonos", "price": 249.0, "original_price": 299.0, "icon": "🎧", "rating": 4.7, "reviews": 1893, "badge": "new", "shipping": "Envío gratis", "description": "ANC adaptativo, audio espacial, chip H2, 36h batería total. La mejor experiencia de audio inalámbrico."}, {"name": "Samsung Neo QLED 8K 75\"", "brand": "Samsung", "category": "tvs", "price": 2499.0, "original_price": 3499.0, "icon": "📺", "rating": 4.6, "reviews": 178, "badge": "sale", "shipping": "Instalación gratis", "description": "Resolución 8K, Neo Quantum HDR, Tizen OS, 144Hz para gaming. La pantalla definitiva para tu hogar."}, {"name": "Samsung Galaxy Tab S10+", "brand": "Samsung", "category": "tablets", "price": 699.0, "original_price": 899.0, "icon": "📲", "rating": 4.7, "reviews": 412, "badge": "sale", "shipping": "Envío gratis", "description": "Snapdragon 8 Gen 3, AMOLED 12.4\" 120Hz, S Pen incluido. Productividad y entretenimiento de nivel Pro."}, {"name": "Xbox Series X", "brand": "Microsoft", "category": "consolas", "price": 499.0, "original_price": 549.0, "icon": "🎮", "rating": 4.8, "reviews": 2134, "badge": "new", "shipping": "Envío gratis", "description": "12 TFLOPS, 4K 120fps, SSD 1TB, Game Pass Ultimate. El Xbox más potente de la historia."}, {"name": "DJI Osmo Pocket 3", "brand": "DJI", "category": "drones", "price": 519.0, "original_price": 599.0, "icon": "📷", "rating": 4.8, "reviews": 265, "badge": "new", "shipping": "Envío gratis", "description": "Cámara 4K/120fps, sensor 1\", 3 ejes estabilización, ActiveTrack 6.0. La cámara gimbal perfecta para vlogs."}, {"name": "Keychron Q3 Pro", "brand": "Keychron", "category": "accesorios", "price": 169.0, "original_price": 199.0, "icon": "⌨️", "rating": 4.9, "reviews": 1102, "badge": "hot", "shipping": "Envío gratis", "description": "Teclado mecánico 75%, switches Gateron G Pro, aluminio CNC, Bluetooth/USB. El favorito de los entusiastas."}]
        for item in data:
            db.session.add(Producto(**item))
        db.session.commit()

with app.app_context():
    db.create_all()
    seed_data()

if __name__ == "__main__":
    app.run(debug=True)
