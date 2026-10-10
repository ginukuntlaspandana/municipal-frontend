import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicApi } from '../api';
import { Loader } from '../components/Loader';
import { 
  Trash2, 
  Car, 
  Waves, 
  Lightbulb, 
  Droplets, 
  Trees, 
  ShieldAlert, 
  ChevronRight, 
  Layers 
} from 'lucide-react';

const iconMap = {
  Trash2,
  Car,
  Waves,
  Lightbulb,
  Droplets,
  Trees,
};

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getCategories()
      .then((res) => {
        if (res.data && res.data.data) {
          setCategories(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span style={{ color: 'var(--accent-green)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
          Civic Issue Classifications
        </span>
        <h1 style={{ fontSize: '2.2rem', color: 'var(--primary-navy)', fontWeight: 800, marginTop: '0.25rem' }}>
          Municipal Issue Categories
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
          Complaints are routed directly to corresponding specialized departments for rapid resolution.
        </p>
      </div>

      {loading ? (
        <Loader text="Loading categories..." />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {categories.map((cat) => {
            const IconComp = iconMap[cat.icon] || ShieldAlert;
            return (
              <div key={cat.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: '48px', height: '48px', background: '#ecfdf5', color: 'var(--accent-green-dark)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <IconComp size={26} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)', fontWeight: 700 }}>
                        {cat.name}
                      </h3>
                      <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: 600 }}>
                        Active Category
                      </span>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    {cat.description}
                  </p>
                </div>
                <Link to={`/citizen/submit?categoryId=${cat.id}`} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Lodge Grievance in this Category <ChevronRight size={16} />
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
