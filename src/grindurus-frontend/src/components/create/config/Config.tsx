import React, { useEffect, useState } from 'react';
import { Checkbox, FormGroup } from '@/components/ui';
import { ethers } from 'ethers';
import { IURUS } from '@/typechain-types/AgentsNFT';

function Config({ setConfig, setSubnodesMax }: { setConfig: (config: any) => void; setSubnodesMax: ((value: string) => void) | null }) {

    const [configMode, setConfigMode] = useState<'manual' | 'default'>('default')
    const [localSubnodesMax, setLocalSubnodesMax] = useState<string>('1')
    const [longNumberMax, setLongNumberMax] = useState<string>('3')
    const [hedgeNumberMax, setHedgeNumberMax] = useState<string>('3')
    const [extraCoefficient, setExtraCoefficient] = useState<string>('2.0')
    const [priceVolatilityPercent, setPriceVolatilityPercent] = useState<string>('1.0')
    const [returnPercentLongSell, setReturnPercentLongSell] = useState<string>('100.5')
    const [returnPercentHedgeSell, setReturnPercentHedgeSell] = useState<string>('100.5')
    const [returnPercentHedgeRebuy, setReturnPercentHedgeRebuy] = useState<string>('100.5')

    useEffect(() => {
      updateSubnodesMax()
    }, [localSubnodesMax])

    useEffect(() => {
      updateConfig()
    }, [longNumberMax, hedgeNumberMax, extraCoefficient, priceVolatilityPercent, returnPercentLongSell, returnPercentHedgeSell, returnPercentHedgeRebuy])

    const updateConfig = () => {
      try {
        const longNumberMaxFormatted = ethers.parseUnits(longNumberMax, 0)
        const hedgeNumberMaxFormatted = ethers.parseUnits(hedgeNumberMax, 0)
        const extraCoeficientFormatted = ethers.parseUnits(extraCoefficient, 2)
        const priceVolatilityFormatted = ethers.parseUnits(priceVolatilityPercent, 2)
        const longSellReturnPercentFormatted = ethers.parseUnits(returnPercentLongSell, 2) 
        const hedgeSellReturnPercentFormatted = ethers.parseUnits(returnPercentHedgeSell, 2)
        const hedgeRebuyReturnPercentFormatted = ethers.parseUnits(returnPercentHedgeRebuy, 2)

        setConfig({
            longNumberMax: longNumberMaxFormatted,
            hedgeNumberMax: hedgeNumberMaxFormatted,
            extraCoef: extraCoeficientFormatted,
            priceVolatilityPercent: priceVolatilityFormatted,
            returnPercentLongSell: longSellReturnPercentFormatted,
            returnPercentHedgeSell: hedgeSellReturnPercentFormatted,
            returnPercentHedgeRebuy: hedgeRebuyReturnPercentFormatted
        });
      } catch {

      }

    };

    const updateSubnodesMax = () => {
      if (setSubnodesMax) {
        setSubnodesMax(localSubnodesMax)
      }
    }

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
                      setPriceVolatilityPercent('1.0')
                      setReturnPercentLongSell('100.5')
                      setReturnPercentHedgeSell('100.5')
                      setReturnPercentHedgeRebuy('100.5')
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
                  }}
                  />
                  <button
                  className="config-button button"
                  type="button"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => {
                      setLocalSubnodesMax('1')
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
                    console.log("tv")
                    console.log(e.target.value)
                      setLongNumberMax(e.target.value)
                  }}
                />
                <button
                  className="config-button button"
                  type="button"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => {
                      setLongNumberMax('3')
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
                  }}
                />
                <button
                  className="config-button button"
                  type="button"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => {
                      setHedgeNumberMax('3');
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
                  }}
                />
                <button
                  className="config-button button"
                  type="button"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => {
                      setExtraCoefficient('2.0')
                  }}
                >
                  Default
                </button>
              </div>
            </FormGroup>
            <FormGroup label="Price Volatility (%)">
              <div className="form-input">
                <input
                  value={priceVolatilityPercent}
                  placeholder="1"
                  onChange={(e) => {
                    setPriceVolatilityPercent(e.target.value)
                  }}
                />
                <button
                  className="config-button button"
                  type="button"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => {
                    setPriceVolatilityPercent('1.0')
                  }}
                >
                  Default
                </button>
              </div>
            </FormGroup>
            <FormGroup label="Long Sell Return Percent (%)">
              <div className="form-input">
                <input
                  value={returnPercentLongSell}
                  placeholder="3"
                  onChange={(e) => {
                    setReturnPercentLongSell(e.target.value)
                  }}
                />
                <button
                  className="config-button button"
                  type="button"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => {
                    setReturnPercentLongSell('100.5')
                  }}
                >
                  Default
                </button>
              </div>
            </FormGroup>
            <FormGroup label="Hedge Sell Return Percent (%)">
              <div className="form-input">
                <input
                  value={returnPercentHedgeSell}
                  placeholder="100.5"
                  onChange={(e) => {
                      setReturnPercentHedgeSell(e.target.value)
                  }}
                />
                <button
                  className="config-button button"
                  type="button"
                  style={{ whiteSpace: 'nowrap' }}
                  onClick={() => {
                      setReturnPercentHedgeSell('100.5')
                  }}
                >
                  Default
                </button>
              </div>
            </FormGroup>
            <FormGroup label="Hedge Rebuy Return Percent (%)">
              <div className="form-input">
              <input
                value={returnPercentHedgeRebuy}
                placeholder="100.5"
                onChange={(e) => {
                  setReturnPercentHedgeRebuy(e.target.value)
                }}
              />
              <button
                className="config-button button"
                type="button"
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => {
                  setReturnPercentHedgeRebuy('100.5')
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