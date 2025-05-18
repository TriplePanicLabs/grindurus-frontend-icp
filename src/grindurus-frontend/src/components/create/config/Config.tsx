import React, { useState } from 'react';
import { Checkbox, FormGroup } from '@/components/ui'; // Replace with actual imports

function Config({ setConfig, setSubnodesMax }: { setConfig: (config: any) => void; setSubnodesMax: ((value: string) => void) | null }) {

    const [configMode, setConfigMode] = useState<'manual' | 'default'>('default')
    const [localSubnodesMax, setLocalSubnodesMax] = useState('1')
    const [longNumberMax, setLongNumberMax] = useState('3')
    const [hedgeNumberMax, setHedgeNumberMax] = useState('3')
    const [extraCoefficient, setExtraCoefficient] = useState('2.0')
    const [priceVolatility, setPriceVolatility] = useState('1.0')
    const [longSellReturnPercent, setLongSellReturnPercent] = useState('100.5')
    const [hedgeSellReturnPercent, setHedgeSellReturnPercent] = useState('100.5')
    const [hedgeRebuyReturnPercent, setHedgeRebuyReturnPercent] = useState('100.5')

    const updateConfig = () => {
        setConfig({
            configMode,
            longNumberMax,
            hedgeNumberMax,
            extraCoefficient,
            priceVolatility,
            longSellReturnPercent,
            hedgeSellReturnPercent,
            hedgeRebuyReturnPercent,
        });
    };

    return (
      <div className="config">
        <Checkbox
          defaultChecked={false}
            onChange={(e) => {
                const mode = e ? 'manual' : 'default';
                setConfigMode(mode);
                updateConfig();
            }}
        >
            Change Config
        </Checkbox>
        {configMode === 'manual' && (
            <>
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    style={{ width: '50%' }}
                    className="button"
                    type="button"
                    onClick={() => {
                      if (setSubnodesMax) {
                        setSubnodesMax('1')
                      }
                      setLocalSubnodesMax('1')
                      setLongNumberMax('3')
                      setHedgeNumberMax('3')
                      setExtraCoefficient('2.0')
                      setPriceVolatility('1.0')
                      setLongSellReturnPercent('100.5')
                      setHedgeSellReturnPercent('100.5')
                      setHedgeRebuyReturnPercent('100.5')
                      updateConfig()
                    }}
                  >
                    Set Default Config
                </button>
              </div>
            </div>
            {setSubnodesMax && (
              <FormGroup label="Subnodes Max">
              <div className="form-input">
                  <input
                  value={localSubnodesMax}
                  placeholder="1"
                  onChange={(e) => {
                    setLocalSubnodesMax(e.target.value)
                    updateConfig()
                  }}
                  />
                  <button
                  className="config-button button"
                  type="button"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => {
                      setLocalSubnodesMax('1')
                      updateConfig();
                  }}
                  >
                  Default
                  </button>
              </div>
              </FormGroup>
            )}
            <FormGroup label="Long Number Max">
              <div className="form-input">
                <input
                  value={longNumberMax}
                  placeholder="3"
                  onChange={(e) => {
                      setLongNumberMax(e.target.value)
                      updateConfig();
                  }}
                />
                <button
                  className="config-button button"
                  type="button"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => {
                      setLongNumberMax('3');
                      updateConfig();
                  }}
                >
                  Default
                </button>
              </div>
            </FormGroup>
            <FormGroup label="Hedge Number Max">
              <div className="form-input">
                <input
                  value={hedgeNumberMax}
                  placeholder="3"
                  onChange={(e) => {
                      setHedgeNumberMax(e.target.value)
                      updateConfig();
                  }}
                />
                <button
                  className="config-button button"
                  type="button"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => {
                      setHedgeNumberMax('3');
                      updateConfig();
                  }}
                >
                  Default
                </button>
              </div>
            </FormGroup>
            <FormGroup label="Extra Coefficient">
              <div className="form-input">
                <input
                  value={extraCoefficient}
                  placeholder="2.0"
                  onChange={(e) => {
                      setExtraCoefficient(e.target.value)
                      updateConfig();
                  }}
                />
                <button
                  className="config-button button"
                  type="button"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => {
                      setExtraCoefficient('2.0')
                      updateConfig();
                  }}
                >
                  Default
                </button>
              </div>
            </FormGroup>
            <FormGroup label="Price Volatility (%)">
              <div className="form-input">
                <input
                  value={priceVolatility}
                  placeholder="1"
                  onChange={(e) => {
                      setPriceVolatility(e.target.value)
                      updateConfig();
                  }}
                />
                <button
                  className="config-button button"
                  type="button"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => {
                      setPriceVolatility('1.0')
                      updateConfig();
                  }}
                >
                  Default
                </button>
              </div>
            </FormGroup>
            <FormGroup label="Long Sell Return Percent (%)">
              <div className="form-input">
                <input
                  value={longSellReturnPercent}
                  placeholder="3"
                  onChange={(e) => {
                      setLongSellReturnPercent(e.target.value)
                      updateConfig();
                  }}
                />
                <button
                  className="config-button button"
                  type="button"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => {
                      setLongSellReturnPercent('100.5')
                      updateConfig();
                  }}
                >
                  Default
                </button>
              </div>
            </FormGroup>
            <FormGroup label="Hedge Sell Return Percent (%)">
              <div className="form-input">
                <input
                  value={hedgeSellReturnPercent}
                  placeholder="100.5"
                  onChange={(e) => {
                      setHedgeSellReturnPercent(e.target.value)
                      updateConfig();
                  }}
                />
                <button
                  className="config-button button"
                  type="button"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => {
                      setHedgeSellReturnPercent('100.5')
                      updateConfig();
                  }}
                >
                  Default
                </button>
              </div>
            </FormGroup>
            <FormGroup label="Hedge Rebuy Return Percent (%)">
              <div className="form-input">
              <input
                value={hedgeRebuyReturnPercent}
                placeholder="100.5"
                onChange={(e) => {
                    setHedgeRebuyReturnPercent(e.target.value)
                    updateConfig();
                }}
              />
              <button
                className="config-button button"
                type="button"
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => {
                    setHedgeRebuyReturnPercent('100.5')
                    updateConfig();
                }}
              >
                Default
              </button>
            </div>
          </FormGroup>
        </>
      )}
    </div>
  );
};

export default Config