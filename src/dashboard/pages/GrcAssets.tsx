import React, { useEffect, useState } from 'react';
import { hyperlynxApi } from '../services/hyperlynxApi';

export function GrcAssets() {
  const [assets, setAssets] = useState<Array<{ id: number; name: string; asset_type: string; criticality: number; owner?: string }>>([]);
  const [name, setName] = useState('');
  const [assetType, setAssetType] = useState('application');
  const [criticality, setCriticality] = useState(3);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await hyperlynxApi.getAssets();
      setAssets(data.results || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const createAsset = async () => {
    if (!name.trim()) return;
    await hyperlynxApi.createAsset({ name, asset_type: assetType, criticality });
    setName('');
    await load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Assets</h1>
        <p className="text-sm text-gray-600 mt-1">Asset inventory and criticality tracking.</p>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <h2 className="font-semibold text-gray-900 mb-3">Add Asset</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <input className="border rounded-md px-3 py-2" placeholder="Asset name" value={name} onChange={(e) => setName(e.target.value)} />
          <select className="border rounded-md px-3 py-2" value={assetType} onChange={(e) => setAssetType(e.target.value)}>
            <option value="application">Application</option>
            <option value="infrastructure">Infrastructure</option>
            <option value="data">Data</option>
            <option value="vendor">Vendor</option>
          </select>
          <select className="border rounded-md px-3 py-2" value={criticality} onChange={(e) => setCriticality(Number(e.target.value))}>
            <option value={1}>1 - Low</option>
            <option value={2}>2</option>
            <option value={3}>3 - Medium</option>
            <option value={4}>4</option>
            <option value={5}>5 - High</option>
          </select>
          <button onClick={createAsset} className="px-4 py-2 bg-black text-white rounded-md">Create</button>
        </div>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="px-4 py-3 border-b font-semibold text-gray-900">Asset Register ({assets.length})</div>
        <div className="max-h-[480px] overflow-auto">
          {loading ? (
            <div className="p-4 text-sm text-gray-500">Loading assets…</div>
          ) : (
            assets.map((asset) => (
              <div key={asset.id} className="px-4 py-3 border-b text-sm grid grid-cols-1 md:grid-cols-4 gap-2">
                <p className="font-medium text-gray-900">{asset.name}</p>
                <p className="text-gray-600">{asset.asset_type}</p>
                <p className="text-gray-600">Criticality: {asset.criticality}</p>
                <p className="text-gray-500">{asset.owner || 'Unassigned'}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
