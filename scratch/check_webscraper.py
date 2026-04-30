import requests

API_TOKEN = "wFDjRNNQAOc3kPd33ygJDReVEAqNya9BjAkSN2GquE3g33aZiV6gKCK42pOO"
URL = f"https://api.webscraper.io/api/v1/sitemaps?api_token={API_TOKEN}"

def check_sitemaps():
    try:
        response = requests.get(URL)
        response.raise_for_status()
        data = response.json()
        print("Sitemaps found:")
        print(data)
    except Exception as e:
        print(f"Error: {e}")
        if hasattr(e, 'response') and e.response:
            print(f"Response: {e.response.text}")

if __name__ == "__main__":
    check_sitemaps()
