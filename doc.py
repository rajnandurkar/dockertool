from flask import Flask, render_template, jsonify
from flask_cors import CORS
import docker
import json
import os
import threading
import time

app = Flask(__name__)
try:
    CORS(app)
except Exception:
    pass

client = docker.from_env()

stats_lock = threading.Lock()
container_stats = {}
STATS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'container_stats.json')

@app.route('/')
def index():
    return render_template('container_stats.html')

@app.route('/stats')
def get_stats():
    update_container_stats()
    return jsonify(container_stats)

def get_container_stats():
    stats = {}
    try:
        containers = client.containers.list()
        for container in containers:
            try:
                s = container.stats(stream=False)
                cid = s['id']
                cpu_stats = s.get('cpu_stats', {})
                cpu_usage = cpu_stats.get('cpu_usage', {})
                percpu = cpu_usage.get('percpu_usage') or [0]*12
                throttling = cpu_stats.get('throttling_data', {})

                cpu_per_process = {}
                for i, usage in enumerate(percpu):
                    cpu_per_process[f"CPU_{i + 1}"] = {
                        "total_usage": usage,
                        "usage_in_kernelmode": cpu_usage.get('usage_in_kernelmode', 0),
                        "usage_in_usermode": cpu_usage.get('usage_in_usermode', 0),
                    }

                networks = s.get('networks', {})
                rx_bytes = sum(net.get('rx_bytes', 0) for net in networks.values())
                tx_bytes = sum(net.get('tx_bytes', 0) for net in networks.values())
                rx_packets = sum(net.get('rx_packets', 0) for net in networks.values())
                tx_packets = sum(net.get('tx_packets', 0) for net in networks.values())

                mem = s.get('memory_stats', {})

                stats[cid] = {
                    "id": cid,
                    "name": container.name,
                    "status": container.status,
                    "cpu_stats": {
                        "per_process": cpu_per_process,
                        "total_usage": sum(percpu),
                        "usage_in_kernelmode": cpu_usage.get('usage_in_kernelmode', 0),
                        "usage_in_usermode": cpu_usage.get('usage_in_usermode', 0),
                        "throttling_data": {
                            "periods": throttling.get('periods', 0),
                            "throttled_periods": throttling.get('throttled_periods', 0),
                            "throttled_time": throttling.get('throttled_time', 0),
                            "throttled_rate": round((throttling.get('throttled_periods', 0) / max(throttling.get('periods', 1), 1)) * 100, 1)
                        }
                    },
                    "memory_stats": {
                        "total_usage": mem.get('usage', 0),
                        "max_usage": mem.get('max_usage', 0),
                        "limit": mem.get('limit', 0),
                        "usage_mb": round(mem.get('usage', 0) / (1024*1024), 2),
                        "max_usage_mb": round(mem.get('max_usage', 0) / (1024*1024), 2),
                        "limit_mb": round(mem.get('limit', 0) / (1024*1024), 2)
                    },
                    "network_stats": {
                        "rx_bytes": rx_bytes,
                        "tx_bytes": tx_bytes,
                        "rx_packets": rx_packets,
                        "tx_packets": tx_packets
                    }
                }
            except Exception as e:
                print(f"Error reading stats for container {container.name}: {e}")
    except Exception as e:
        print(f"Error querying docker client: {e}")

    # Persist snapshot to file for frontend
    if stats:
        try:
            with open(STATS_FILE, 'w') as f:
                json.dump(stats, f, indent=2)
        except Exception as e:
            print(f"Error saving stats file: {e}")

    return stats

def update_container_stats():
    global container_stats
    with stats_lock:
        container_stats = get_container_stats()

if __name__ == '__main__':
    # Periodically update container stats in the background every 2s
    def update_stats_background():
        while True:
            update_container_stats()
            time.sleep(2)

    background_thread = threading.Thread(target=update_stats_background, daemon=True)
    background_thread.start()

    # Start the Flask app
    app.run(debug=True, host='0.0.0.0', port=5000)
