# Notebooks

| Notebook | Purpose |
|----------|---------|
| `data_exploration.ipynb` | Explore merged dataset stats, class balance, language mix, and preprocessing preview |

## Run

```bash
pip install -r requirements.txt
pip install -e .
python scripts/merge_datasets.py
jupyter notebook notebooks/data_exploration.ipynb
```

Open the notebook from the **project root** so paths resolve correctly.
