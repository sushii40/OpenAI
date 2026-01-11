import pandas as pd
import os
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'dairy_dataset.csv')
print('Path:', p)
print('Exists:', os.path.exists(p))
if os.path.exists(p):
    df = pd.read_csv(p)
    print('Columns:', list(df.columns))
    print(df.head().to_string())
else:
    print('No file found')
