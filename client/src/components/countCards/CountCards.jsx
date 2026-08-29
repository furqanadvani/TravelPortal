import React from 'react';
import './CountCards.css';
import { formatCountsArray, readableText } from '../../utils/Methods';

const SKELETON_COUNT = 6;

const CountCards = ({ stats = [], type, loading = false, onCardClick }) => {

    const getCardClass = (status) => {
        if (!status) return 'count-card-default';
        return status === 'annual' || status === 'TOTAL'
            ? 'count-card-blue'
            : `count-card-${status.replace(/_/g, '-')}`;
    };

    if (loading) {
        return (
            <div className='count-main'>
                <div className="count-cards">
                    {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                        <div className="count-card-body count-card-skeleton" key={index}>
                            <div className="skeleton-line skeleton-title" />
                            <div className="skeleton-line skeleton-number" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className='count-main'>
            <div className="count-cards">
                {formatCountsArray(stats, type)?.map((item, index) => {
                    const isClickable = item.count > 0 && !!onCardClick;
                    return (
                        <div
                            className={`count-card-body ${getCardClass(item.status)} ${isClickable ? 'is-clickable' : 'is-disabled'}`}
                            key={item.status ?? index}
                            role={isClickable ? "button" : undefined}
                            tabIndex={isClickable ? 0 : undefined}
                            onClick={() => {
                                if (isClickable) onCardClick(item);
                            }}
                            onKeyDown={(e) => {
                                if (isClickable && (e.key === "Enter" || e.key === " ")) {
                                    e.preventDefault();
                                    onCardClick(item);
                                }
                            }}
                        >
                            <div className="count-title">
                                <h4>{readableText(item?.status)}</h4>
                            </div>
                            <div className="count-stats">
                                <h3>{item.count}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CountCards;